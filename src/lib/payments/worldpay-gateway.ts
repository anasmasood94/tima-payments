import { PaymentGatewayId, PaymentStatus } from "@prisma/client";
import type { HostedCheckoutInput, HostedCheckoutOutput, PaymentGatewayAdapter } from "./types";
import { verifyStandardWebhookHmac } from "./verify-webhook-hmac";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Worldpay (FIS): hosted payment pages — card entry at Worldpay.
 */
export const worldpayGateway: PaymentGatewayAdapter = {
  gatewayId: PaymentGatewayId.WORLDPAY,

  async createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutOutput> {
    const username = process.env.WORLDPAY_USERNAME;
    const password = process.env.WORLDPAY_PASSWORD;

    if (!username || !password) {
      const url = `${appUrl()}/portal/pay/${input.paymentId}`;
      return {
        hostedCheckoutUrl: url,
        providerPaymentId: `wp_stub_${input.paymentId}`,
        metadata: { stub: true, reason: "missing_worldpay_credentials" },
      };
    }

    const url = `${appUrl()}/portal/pay/${input.paymentId}`;
    return {
      hostedCheckoutUrl: url,
      providerPaymentId: `wp_${input.paymentId}`,
      metadata: { note: "replace_with_worldpay_order_code" },
    };
  },

  verifyWebhookRequest(headers: Headers, rawBody: string) {
    const secret = process.env.WORLDPAY_WEBHOOK_SECRET;
    return verifyStandardWebhookHmac(headers, rawBody, secret);
  },

  parseWebhookPayload(rawBody: unknown) {
    if (!rawBody || typeof rawBody !== "object") return null;
    const body = rawBody as Record<string, unknown>;
    const orderCode =
      typeof body.orderCode === "string"
        ? body.orderCode
        : typeof body.ordercode === "string"
          ? body.ordercode
          : typeof body.paymentReference === "string"
            ? body.paymentReference
            : typeof body.PaymentReference === "string"
              ? body.PaymentReference
              : null;
    if (!orderCode) return null;

    const lastEventRaw =
      typeof body.lastEvent === "string"
        ? body.lastEvent
        : typeof body.LastEvent === "string"
          ? body.LastEvent
          : typeof body.last_event === "string"
            ? body.last_event
            : "";
    const lastEvent = lastEventRaw.toUpperCase();
    let status: PaymentStatus = PaymentStatus.PROCESSING;
    if (lastEvent.includes("AUTHORISED") || lastEvent === "CAPTURED") status = PaymentStatus.SUCCEEDED;
    if (lastEvent.includes("REFUSED") || lastEvent.includes("ERROR")) status = PaymentStatus.FAILED;
    if (lastEvent.includes("REFUND")) status = PaymentStatus.REFUNDED;
    return { providerPaymentId: orderCode, status };
  },
};
