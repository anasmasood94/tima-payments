import { PaymentGatewayId, PaymentStatus } from "@prisma/client";
import type { HostedCheckoutInput, HostedCheckoutOutput, PaymentGatewayAdapter } from "./types";
import { verifyStandardWebhookHmac } from "./verify-webhook-hmac";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Nuvei: hosted payment page / SafeCharge flow — no card data in this application.
 */
export const nuveiGateway: PaymentGatewayAdapter = {
  gatewayId: PaymentGatewayId.NUVEI,

  async createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutOutput> {
    const merchantId = process.env.NUVEI_MERCHANT_ID;
    const siteId = process.env.NUVEI_MERCHANT_SITE_ID;
    const secret = process.env.NUVEI_SECRET_KEY;

    if (!merchantId || !siteId || !secret) {
      const url = `${appUrl()}/portal/pay/${input.paymentId}`;
      return {
        hostedCheckoutUrl: url,
        providerPaymentId: `nuvei_stub_${input.paymentId}`,
        metadata: { stub: true, reason: "missing_nuvei_credentials" },
      };
    }

    const url = `${appUrl()}/portal/pay/${input.paymentId}`;
    return {
      hostedCheckoutUrl: url,
      providerPaymentId: `nuvei_${input.paymentId}`,
      metadata: { note: "replace_with_real_session_token" },
    };
  },

  verifyWebhookRequest(headers: Headers, rawBody: string) {
    const secret = process.env.NUVEI_WEBHOOK_SECRET;
    return verifyStandardWebhookHmac(headers, rawBody, secret);
  },

  parseWebhookPayload(rawBody: unknown) {
    if (!rawBody || typeof rawBody !== "object") return null;
    const body = rawBody as Record<string, unknown>;
    const id =
      typeof body.TransactionID === "string"
        ? body.TransactionID
        : typeof body.transactionId === "string"
          ? body.transactionId
          : null;
    if (!id) return null;
    const statusRaw = typeof body.Status === "string" ? body.Status : typeof body.status === "string" ? body.status : "";
    const s = String(statusRaw).toLowerCase();
    let status: PaymentStatus = PaymentStatus.PROCESSING;
    if (s.includes("approve") || s === "approved") status = PaymentStatus.SUCCEEDED;
    if (s.includes("declin") || s === "error") status = PaymentStatus.FAILED;
    if (s.includes("refund")) status = PaymentStatus.REFUNDED;
    return { providerPaymentId: id, status };
  },
};
