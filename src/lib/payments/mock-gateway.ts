import { PaymentGatewayId } from "@prisma/client";
import type { HostedCheckoutInput, HostedCheckoutOutput, PaymentGatewayAdapter, RefundInput, RefundOutput } from "./types";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export const mockGateway: PaymentGatewayAdapter = {
  gatewayId: PaymentGatewayId.MOCK,

  async createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutOutput> {
    const url = `${appUrl()}/portal/pay/${input.paymentId}`;
    return {
      hostedCheckoutUrl: url,
      providerPaymentId: `mock_${input.paymentId}`,
      metadata: { mode: "mock_hosted_checkout" },
    };
  },

  async refundPayment(input: RefundInput): Promise<RefundOutput> {
    return { success: true, providerRefundId: `mock_refund_${input.providerPaymentId}` };
  },

  verifyWebhookRequest(headers: Headers, rawBody: string) {
    void headers;
    void rawBody;
    return true;
  },

  parseWebhookPayload() {
    return null;
  },
};
