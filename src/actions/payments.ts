"use server";

import { OrderStatus, PaymentGatewayId, PaymentStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { revalidatePathsAfterResponse } from "@/lib/revalidate-after-response";
import { requireSession } from "@/lib/auth/session";
import { getPaymentGatewayAdapter } from "@/lib/payments/registry";
import { applyPaymentStatusByIdForUser } from "@/lib/payments/apply-payment-status";
import {
  airwallexApiBase,
  airwallexLoginDetailed,
  retrieveAirwallexPaymentIntent,
} from "@/lib/payments/airwallex-api";

function resolveAirwallexJsEnv(): "demo" | "prod" {
  const explicit = process.env.NEXT_PUBLIC_AIRWALLEX_ENV?.toLowerCase();
  if (explicit === "prod" || explicit === "production") return "prod";
  if (explicit === "demo") return "demo";
  const base = process.env.AIRWALLEX_API_BASE?.toLowerCase() ?? "";
  return base.includes("demo") ? "demo" : "prod";
}

export type SyncAirwallexOrderPaymentsResult =
  | { ok: true; orderStatus: OrderStatus | null; appliedChange: boolean }
  | { ok: false; error: string };

/**
 * Reconciles pending Airwallex payment intents for an order against the Airwallex API (authoritative status).
 * Use after the shopper returns from Hosted Payment Page and for short polling while webhooks may be delayed.
 */
export async function syncAirwallexPaymentsForOrderAction(orderId: string): Promise<SyncAirwallexOrderPaymentsResult> {
  const session = await requireSession();
  let appliedChange = false;

  const payments = await prisma.payment.findMany({
    where: {
      status: { in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING] },
      gateway: PaymentGatewayId.AIRWALLEX,
      invoice: { orderId, order: { userId: session.sub } },
      providerPaymentId: { not: null },
      NOT: { providerPaymentId: { startsWith: "awx_stub_" } },
    },
  });

  for (const p of payments) {
    const intentId = p.providerPaymentId;
    if (!intentId) continue;

    const intent = await retrieveAirwallexPaymentIntent(intentId);
    if (!intent) continue;

    const statusUpper = intent.status.toUpperCase();
    if (statusUpper === "SUCCEEDED") {
      const r = await applyPaymentStatusByIdForUser({
        paymentId: p.id,
        userId: session.sub,
        status: PaymentStatus.SUCCEEDED,
      });
      if (r.ok && !("duplicate" in r && r.duplicate)) appliedChange = true;
    } else if (statusUpper === "FAILED") {
      const r = await applyPaymentStatusByIdForUser({
        paymentId: p.id,
        userId: session.sub,
        status: PaymentStatus.FAILED,
      });
      if (r.ok && !("duplicate" in r && r.duplicate)) appliedChange = true;
    } else if (statusUpper === "CANCELLED" || statusUpper === "CANCELED") {
      const r = await applyPaymentStatusByIdForUser({
        paymentId: p.id,
        userId: session.sub,
        status: PaymentStatus.CANCELED,
      });
      if (r.ok && !("duplicate" in r && r.duplicate)) appliedChange = true;
    }
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.sub },
    select: { status: true },
  });

  if (appliedChange) {
    revalidatePathsAfterResponse(["/portal", "/admin", `/portal/orders/${orderId}`]);
  }

  return { ok: true, orderStatus: order?.status ?? null, appliedChange };
}

export async function startHostedCheckoutFormAction(_prev: unknown, formData: FormData) {
  const session = await requireSession();
  const invoiceId = formData.get("invoiceId");
  if (typeof invoiceId !== "string" || !invoiceId) {
    return { error: "Invalid invoice." };
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, order: { userId: session.sub } },
    include: { order: true },
  });

  if (!invoice) {
    return { error: "Invoice not found." };
  }

  if (invoice.status !== "ISSUED") {
    return { error: "This invoice is not payable." };
  }

  if (invoice.amountCents <= 0) {
    return { error: "Nothing to pay on this invoice." };
  }

  const adapter = getPaymentGatewayAdapter();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.sub } });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const returnUrl = `${appUrl}/portal/invoices/${invoice.id}?paid=1`;
  const cancelUrl = `${appUrl}/portal/invoices/${invoice.id}`;

  const payment = await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      gateway: adapter.gatewayId,
      status: PaymentStatus.PENDING,
      amountCents: invoice.amountCents,
      currency: invoice.currency,
    },
  });

  const checkout = await adapter.createHostedCheckout({
    paymentId: payment.id,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    orderId: invoice.orderId,
    amountCents: invoice.amountCents,
    currency: invoice.currency,
    customerEmail: user.email,
    returnUrl,
    cancelUrl,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      hostedCheckoutUrl: checkout.hostedCheckoutUrl,
      providerPaymentId: checkout.providerPaymentId,
      metadata: checkout.metadata as object | undefined,
    },
  });

  redirect(checkout.hostedCheckoutUrl);
}

export type PrepareAirwallexHostedPaymentResult =
  | { ok: true; redirect: string }
  | {
      ok: true;
      intentId: string;
      clientSecret: string;
      currency: string;
      successUrl: string;
      cancelUrl: string;
      shopperEmail?: string;
      countryCode: string;
      awxEnv: "demo" | "prod";
    }
  | { ok: false; error: string };

/**
 * Loads a fresh Payment Intent `client_secret` (not stored in DB) and options for Airwallex Hosted Payment Page.
 */
export async function prepareAirwallexHostedPaymentAction(
  paymentId: string,
): Promise<PrepareAirwallexHostedPaymentResult> {
  const session = await requireSession();
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, invoice: { order: { userId: session.sub } } },
    include: { invoice: { select: { id: true, orderId: true } } },
  });

  if (!payment) {
    return { ok: false, error: "Payment not found." };
  }
  if (payment.gateway !== PaymentGatewayId.AIRWALLEX) {
    return { ok: false, error: "This checkout is not using Airwallex." };
  }
  if (!payment.providerPaymentId || payment.providerPaymentId.startsWith("awx_stub_")) {
    const stubMeta = (payment.metadata ?? {}) as Record<string, unknown>;
    const reason = typeof stubMeta.reason === "string" ? stubMeta.reason : null;
    const fresh =
      Boolean(process.env.AIRWALLEX_CLIENT_ID?.trim()) && Boolean(process.env.AIRWALLEX_API_KEY?.trim());
    const newCheckout =
      " This payment link is from an old attempt—after fixing configuration, restart the dev server and place the order (or pay the invoice) again to open a new checkout.";

    if (reason === "airwallex_login_failed") {
      const live = await airwallexLoginDetailed();
      if (live.ok) {
        return {
          ok: false,
          error:
            "This checkout was saved when Airwallex login failed, but your credentials work now. Start a new checkout from the catalog or invoice—this URL cannot be upgraded." +
            newCheckout,
        };
      }

      const apiBaseNow = airwallexApiBase();
      const storedBase = typeof stubMeta.apiBaseUsed === "string" ? stubMeta.apiBaseUsed : null;
      const parts: string[] = ["Airwallex login is still failing for the server process."];

      if (live.reason === "http") {
        parts.push(`HTTP ${live.status}${live.message ? `: ${live.message}` : ""}.`);
        if (live.status === 401 || live.status === 403) {
          parts.push(
            "Confirm AIRWALLEX_CLIENT_ID and AIRWALLEX_API_KEY match Airwallex web app → Developer / API keys. The value must be the API key secret—not a webhook signing secret or unrelated id.",
          );
        }
        parts.push(
          apiBaseNow.includes("demo")
            ? "Demo keys must use AIRWALLEX_API_BASE=https://api-demo.airwallex.com (default if unset)."
            : "Live keys must use AIRWALLEX_API_BASE=https://api.airwallex.com.",
        );
      } else if (live.reason === "no_token_in_body") {
        parts.push("Airwallex returned 200 but no token in the JSON body.");
      }

      if (storedBase && storedBase !== apiBaseNow) {
        parts.push(`This payment was created using API host ${storedBase}; the server now uses ${apiBaseNow}.`);
      }

      parts.push(newCheckout.trim());
      return { ok: false, error: parts.join(" ") };
    }

    if (reason === "airwallex_create_failed") {
      const httpStatus = typeof stubMeta.status === "number" ? stubMeta.status : null;
      const errObj = stubMeta.error;
      const bits: string[] = [];
      bits.push(`Airwallex payment intent create failed${httpStatus != null ? ` (HTTP ${httpStatus})` : ""}.`);
      if (errObj && typeof errObj === "object") {
        const e = errObj as Record<string, unknown>;
        const code = typeof e.code === "string" ? e.code : null;
        const msg = typeof e.message === "string" ? e.message : null;
        const source = typeof e.source === "string" ? e.source : null;
        const line = [code, msg, source].filter(Boolean).join(" — ");
        if (line) bits.push(line);
        else bits.push(JSON.stringify(errObj).slice(0, 400));
      }
      bits.push(
        "Start a new checkout from the catalog or invoice after pulling the latest app (merchant order id length is fixed for new payments).",
      );
      bits.push(newCheckout.trim());
      return { ok: false, error: bits.join(" ") };
    }

    const hint =
      reason === "missing_airwallex_credentials"
        ? fresh
          ? "This checkout was created when the server could not read Airwallex credentials (restart `npm run dev` after editing `.env`, then start a new checkout)." +
            newCheckout
          : "Set AIRWALLEX_CLIENT_ID and AIRWALLEX_API_KEY in `.env` (use `.env.local` if you prefer), restart the dev server, then start a new checkout." + newCheckout
        : "No real Airwallex payment intent exists for this payment row. Fix env/API issues, restart the dev server, and start checkout again from your order or invoice." +
            newCheckout;
    return { ok: false, error: hint };
  }

  const meta = (payment.metadata ?? {}) as Record<string, unknown>;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const successUrlDefault = `${appUrl}/portal/invoices/${payment.invoice.id}?paid=1`;
  const cancelUrlDefault = `${appUrl}/portal/orders/${payment.invoice.orderId}`;
  const successUrl = typeof meta.successUrl === "string" ? meta.successUrl : successUrlDefault;
  const cancelUrl = typeof meta.cancelUrl === "string" ? meta.cancelUrl : cancelUrlDefault;

  if (payment.status === PaymentStatus.SUCCEEDED) {
    return { ok: true, redirect: successUrl };
  }
  if (payment.status !== PaymentStatus.PENDING && payment.status !== PaymentStatus.PROCESSING) {
    return { ok: false, error: "This payment can no longer be continued." };
  }

  const intent = await retrieveAirwallexPaymentIntent(payment.providerPaymentId);
  if (!intent) {
    return { ok: false, error: "Could not reach Airwallex. Check API keys and try again." };
  }

  const statusUpper = intent.status.toUpperCase();
  if (statusUpper === "SUCCEEDED") {
    await applyPaymentStatusByIdForUser({
      paymentId: payment.id,
      userId: session.sub,
      status: PaymentStatus.SUCCEEDED,
    });
    return { ok: true, redirect: successUrl };
  }
  if (statusUpper === "FAILED" || statusUpper === "CANCELLED") {
    return { ok: false, error: "This payment is no longer valid. Start again from your invoice or order." };
  }

  if (!intent.client_secret) {
    return {
      ok: false,
      error:
        "Airwallex did not return a checkout secret for this payment. It may already be completed or expired.",
    };
  }

  const shopperEmail = typeof meta.shopperEmail === "string" ? meta.shopperEmail : undefined;
  const countryCode = typeof meta.countryCode === "string" ? meta.countryCode : "US";

  return {
    ok: true,
    intentId: intent.id,
    clientSecret: intent.client_secret,
    currency: intent.currency,
    successUrl,
    cancelUrl,
    shopperEmail,
    countryCode,
    awxEnv: resolveAirwallexJsEnv(),
  };
}

export async function completeMockPaymentFormAction(_prev: unknown, formData: FormData) {
  const paymentId = formData.get("paymentId");
  if (typeof paymentId !== "string" || !paymentId) {
    return { error: "Invalid payment." };
  }

  const session = await requireSession();
  const result = await applyPaymentStatusByIdForUser({
    paymentId,
    userId: session.sub,
    status: PaymentStatus.SUCCEEDED,
  });

  if (!result.ok) {
    return { error: "Payment could not be completed." };
  }

  redirect(`/portal/orders/${result.orderId}?paid=1`);
}
