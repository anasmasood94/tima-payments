import { PaymentGatewayId, PaymentStatus } from "@prisma/client";
import { airwallexAmountMajorFromStoreCents, airwallexApiBase, airwallexLoginDetailed } from "./airwallex-api";
import type { HostedCheckoutInput, HostedCheckoutOutput, PaymentGatewayAdapter, RefundInput, RefundOutput } from "./types";
import { verifyAirwallexWebhookSignature } from "./verify-webhook-hmac";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/** Airwallex `merchant_order_id` max length is 64 (API); longer values cause create to fail. */
function buildAirwallexMerchantOrderId(input: HostedCheckoutInput): string {
  const raw = input.orderId
    ? `order_${input.orderId}_${input.paymentId}`
    : input.invoiceNumber
      ? `inv_${input.invoiceNumber}_${input.paymentId}`
      : input.paymentId;
  if (raw.length <= 64) return raw;
  const fallback = `pay_${input.paymentId}`;
  return fallback.length <= 64 ? fallback : fallback.slice(0, 64);
}

/**
 * Airwallex: creates a Payment Intent (server) and sends the shopper to `/portal/pay/:id`, which opens
 * Airwallex Hosted Payment Page via Airwallex.js (`redirectToCheckout`). Card data never touches this app;
 * we persist `providerPaymentId` (intent id) and checkout return URLs in `metadata`.
 * Create payload `amount` is converted from our stored cents to Airwallex **major** units (see `airwallexAmountMajorFromStoreCents`).
 *
 * Without `AIRWALLEX_CLIENT_ID` + `AIRWALLEX_API_KEY`, falls back to the local `/portal/pay/:id` simulator.
 */
export const airwallexGateway: PaymentGatewayAdapter = {
  gatewayId: PaymentGatewayId.AIRWALLEX,

  async createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutOutput> {
    const fallbackUrl = `${appUrl()}/portal/pay/${input.paymentId}`;
    const clientId = process.env.AIRWALLEX_CLIENT_ID?.trim();
    const apiKey = process.env.AIRWALLEX_API_KEY?.trim();
    if (!clientId || !apiKey) {
      return {
        hostedCheckoutUrl: fallbackUrl,
        providerPaymentId: `awx_stub_${input.paymentId}`,
        metadata: { stub: true, reason: "missing_airwallex_credentials" },
      };
    }

    const login = await airwallexLoginDetailed();
    if (!login.ok) {
      const base = airwallexApiBase();
      const meta: Record<string, unknown> = {
        stub: true,
        reason: "airwallex_login_failed",
        apiBaseUsed: base,
      };
      if (login.reason === "http") {
        meta.loginHttpStatus = login.status;
        if (login.message) meta.loginMessage = login.message;
      } else if (login.reason === "no_token_in_body") {
        meta.loginHttpStatus = 200;
        meta.loginMessage = "Login JSON had no token field; check Airwallex API version and credentials.";
      }
      return {
        hostedCheckoutUrl: fallbackUrl,
        providerPaymentId: `awx_stub_${input.paymentId}`,
        metadata: meta,
      };
    }
    const token = login.token;

    const requestId = crypto.randomUUID();
    const merchantOrderId = buildAirwallexMerchantOrderId(input);

    const body: Record<string, unknown> = {
      request_id: requestId,
      amount: airwallexAmountMajorFromStoreCents(input.amountCents, input.currency),
      currency: input.currency,
      merchant_order_id: merchantOrderId,
      return_url: input.returnUrl,
    };

    if (input.orderId) {
      body.metadata = { order_id: input.orderId, payment_id: input.paymentId };
    }

    const res = await fetch(`${airwallexApiBase()}/api/v1/pa/payment_intents/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      return {
        hostedCheckoutUrl: fallbackUrl,
        providerPaymentId: `awx_stub_${input.paymentId}`,
        metadata: { stub: true, reason: "airwallex_create_failed", status: res.status, error: data },
      };
    }

    const intentId = typeof data.id === "string" ? data.id : null;
    if (!intentId) {
      return {
        hostedCheckoutUrl: fallbackUrl,
        providerPaymentId: `awx_stub_${input.paymentId}`,
        metadata: { stub: true, reason: "airwallex_missing_intent_id", response: data },
      };
    }

    const countryCode = process.env.AIRWALLEX_CHECKOUT_COUNTRY_CODE ?? "US";

    return {
      /** In-app bridge loads Airwallex.js and opens Hosted Payment Page (card entry on Airwallex only). */
      hostedCheckoutUrl: fallbackUrl,
      providerPaymentId: intentId,
      metadata: {
        airwallexIntentId: intentId,
        successUrl: input.returnUrl,
        cancelUrl: input.cancelUrl,
        shopperEmail: input.customerEmail,
        countryCode,
      },
    };
  },

  verifyWebhookRequest(headers: Headers, rawBody: string) {
    const secret = process.env.AIRWALLEX_WEBHOOK_SECRET;
    return verifyAirwallexWebhookSignature(headers, rawBody, secret);
  },

  async refundPayment(input: RefundInput): Promise<RefundOutput> {
    const clientId = process.env.AIRWALLEX_CLIENT_ID?.trim();
    const apiKey = process.env.AIRWALLEX_API_KEY?.trim();
    if (!clientId || !apiKey) {
      return { success: true, providerRefundId: `awx_refund_stub_${Date.now()}` };
    }

    const login = await airwallexLoginDetailed();
    if (!login.ok) {
      return { success: false, providerRefundId: null, error: "Airwallex login failed" };
    }

    const res = await fetch(`${airwallexApiBase()}/api/v1/pa/refunds/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${login.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id: crypto.randomUUID(),
        payment_intent_id: input.providerPaymentId,
        amount: airwallexAmountMajorFromStoreCents(input.amountCents, input.currency),
        reason: input.reason ?? "admin_refund",
      }),
    });

    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      const msg = typeof data.message === "string" ? data.message : `HTTP ${res.status}`;
      return { success: false, providerRefundId: null, error: msg };
    }

    const refundId = typeof data.id === "string" ? data.id : `awx_refund_${Date.now()}`;
    return { success: true, providerRefundId: refundId };
  },

  parseWebhookPayload(rawBody: unknown) {
    if (!rawBody || typeof rawBody !== "object") return null;
    const body = rawBody as Record<string, unknown>;

    const data = body.data;
    let source: Record<string, unknown> = body;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const nested = (data as Record<string, unknown>).object;
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        source = nested as Record<string, unknown>;
      }
    }

    const eventName = typeof body.name === "string" ? body.name.toLowerCase() : "";
    const isRefundEvent = eventName.startsWith("refund.");

    // Airwallex refund objects have id "rfnd_xxx" and carry the original
    // payment_intent_id we need for DB lookup. Prefer payment_intent_id when
    // the event is a refund so we match the checkout-time reference.
    let intentId: string | null = null;
    if (isRefundEvent) {
      intentId =
        typeof source.payment_intent_id === "string" ? source.payment_intent_id
        : typeof body.payment_intent_id === "string" ? body.payment_intent_id
        : typeof source.id === "string" && source.id.startsWith("int_") ? source.id
        : typeof body.id === "string" && body.id.startsWith("int_") ? body.id
        : null;
    } else {
      intentId =
        typeof source.id === "string" && source.id.startsWith("int_") ? source.id
        : typeof source.payment_intent_id === "string" ? source.payment_intent_id
        : typeof body.payment_intent_id === "string" ? body.payment_intent_id
        : typeof body.id === "string" && body.id.startsWith("int_") ? body.id
        : null;
    }
    if (!intentId) return null;

    const statusRaw = typeof source.status === "string" ? source.status.toLowerCase() : "";

    let status: PaymentStatus = PaymentStatus.PROCESSING;

    if (eventName.startsWith("refund.")) {
      if (eventName.includes("settled") || eventName.includes("accepted")) {
        status = PaymentStatus.REFUNDED;
      } else if (eventName.includes("failed")) {
        status = PaymentStatus.FAILED;
      }
    } else if (eventName === "payment_intent.succeeded" || statusRaw === "succeeded") {
      status = PaymentStatus.SUCCEEDED;
    } else if (eventName === "payment_intent.cancelled" || statusRaw === "cancelled" || statusRaw === "canceled") {
      status = PaymentStatus.CANCELED;
    } else if (
      statusRaw.includes("failed") ||
      eventName.includes("failed") ||
      eventName.includes("authentication_failed") ||
      eventName.includes("authorization_failed") ||
      eventName.includes("risk_declined")
    ) {
      status = PaymentStatus.FAILED;
    } else if (eventName.includes("payment_attempt.") && (eventName.endsWith(".paid") || eventName.endsWith(".settled"))) {
      status = PaymentStatus.SUCCEEDED;
    } else if (statusRaw.includes("refund")) {
      status = PaymentStatus.REFUNDED;
    }

    return { providerPaymentId: intentId, status };
  },
};
