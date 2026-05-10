import { PaymentGatewayId, PaymentStatus } from "@prisma/client";
import type { HostedCheckoutInput, HostedCheckoutOutput, PaymentGatewayAdapter } from "./types";
import { verifyStandardWebhookHmac } from "./verify-webhook-hmac";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Adyen: Drop-in / hosted checkout — no raw card data in this application.
 * Replace stub with Sessions API / Payments API when credentials are configured.
 */
export const adyenGateway: PaymentGatewayAdapter = {
  gatewayId: PaymentGatewayId.ADYEN,

  async createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutOutput> {
    const apiKey = process.env.ADYEN_API_KEY;
    const merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT;

    if (!apiKey || !merchantAccount) {
      const url = `${appUrl()}/portal/pay/${input.paymentId}`;
      return {
        hostedCheckoutUrl: url,
        providerPaymentId: `adyen_stub_${input.paymentId}`,
        metadata: { stub: true, reason: "missing_adyen_credentials" },
      };
    }

    const url = `${appUrl()}/portal/pay/${input.paymentId}`;
    return {
      hostedCheckoutUrl: url,
      providerPaymentId: `adyen_${input.paymentId}`,
      metadata: { note: "replace_with_real_pspReference_or_session_id" },
    };
  },

  verifyWebhookRequest(headers: Headers, rawBody: string) {
    const hmac = process.env.ADYEN_HMAC_KEY;
    // Staging: `X-Webhook-Signature: sha256=<hmac>` (see `verify-webhook-hmac.ts`). Production Adyen notifications
    // typically use `additionalData.hmacSignature` over a canonical string — extend when wiring live traffic.
    return verifyStandardWebhookHmac(headers, rawBody, hmac);
  },

  parseWebhookPayload(rawBody: unknown) {
    if (!rawBody || typeof rawBody !== "object") return null;
    const body = rawBody as Record<string, unknown>;
    const eventCode = typeof body.eventCode === "string" ? body.eventCode : "";
    const psp = typeof body.pspReference === "string" ? body.pspReference : typeof body.originalReference === "string" ? body.originalReference : null;
    if (!psp) return null;

    let status: PaymentStatus = PaymentStatus.PROCESSING;
    if (eventCode === "AUTHORISATION" && String(body.success).toLowerCase() === "true") {
      status = PaymentStatus.SUCCEEDED;
    }
    if (eventCode === "AUTHORISATION" && String(body.success).toLowerCase() === "false") {
      status = PaymentStatus.FAILED;
    }
    if (eventCode === "REFUND") {
      status = String(body.success).toLowerCase() === "true" ? PaymentStatus.REFUNDED : PaymentStatus.FAILED;
    }
    if (eventCode === "CANCELLATION") {
      status = PaymentStatus.CANCELED;
    }

    return { providerPaymentId: psp, status };
  },
};
