import { PaymentGatewayId, PaymentStatus } from "@prisma/client";
import type { HostedCheckoutInput, HostedCheckoutOutput, PaymentGatewayAdapter } from "./types";
import { verifyStandardWebhookHmac } from "./verify-webhook-hmac";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Cybersource: Secure Acceptance / hosted checkout — sensitive auth at Cybersource.
 * Production webhooks may be JSON or XML; this stub expects JSON for local testing.
 */
export const cybersourceGateway: PaymentGatewayAdapter = {
  gatewayId: PaymentGatewayId.CYBERSOURCE,

  async createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutOutput> {
    const merchantId = process.env.CYBERSOURCE_MERCHANT_ID;
    const keyId = process.env.CYBERSOURCE_KEY_ID;
    const secret = process.env.CYBERSOURCE_SECRET_KEY;

    if (!merchantId || !keyId || !secret) {
      const url = `${appUrl()}/portal/pay/${input.paymentId}`;
      return {
        hostedCheckoutUrl: url,
        providerPaymentId: `cs_stub_${input.paymentId}`,
        metadata: { stub: true, reason: "missing_cybersource_credentials" },
      };
    }

    const url = `${appUrl()}/portal/pay/${input.paymentId}`;
    return {
      hostedCheckoutUrl: url,
      providerPaymentId: `cs_${input.paymentId}`,
      metadata: { note: "replace_with_transaction_id" },
    };
  },

  verifyWebhookRequest(headers: Headers, rawBody: string) {
    const secret = process.env.CYBERSOURCE_WEBHOOK_SECRET;
    return verifyStandardWebhookHmac(headers, rawBody, secret);
  },

  parseWebhookPayload(rawBody: unknown) {
    if (!rawBody || typeof rawBody !== "object") return null;
    const body = rawBody as Record<string, unknown>;
    const id =
      typeof body.id === "string"
        ? body.id
        : typeof body.transactionId === "string"
          ? body.transactionId
          : typeof body.requestID === "string"
            ? body.requestID
            : typeof body.requestId === "string"
              ? body.requestId
              : typeof body.req_reference_number === "string"
                ? body.req_reference_number
                : typeof body.req_transaction_uuid === "string"
                  ? body.req_transaction_uuid
                  : null;
    if (!id) return null;

    const statusRaw = typeof body.status === "string" ? body.status.toLowerCase() : "";
    const decision = typeof body.decision === "string" ? body.decision.toLowerCase() : "";
    const reasonCode = String(body.reasonCode ?? body.reason_code ?? "");
    let status: PaymentStatus = PaymentStatus.PROCESSING;
    if (
      reasonCode === "100" ||
      decision === "accept" ||
      statusRaw.includes("authorized") ||
      statusRaw.includes("captured") ||
      statusRaw === "settled"
    ) {
      status = PaymentStatus.SUCCEEDED;
    }
    if (statusRaw.includes("declined") || statusRaw.includes("failed") || decision === "decline" || decision === "reject") {
      status = PaymentStatus.FAILED;
    }
    if (statusRaw.includes("refund")) {
      status = PaymentStatus.REFUNDED;
    }
    return { providerPaymentId: id, status };
  },
};
