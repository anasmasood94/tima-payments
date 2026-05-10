import { PaymentGatewayId } from "@prisma/client";
import type { HostedCheckoutInput, HostedCheckoutOutput, PaymentGatewayAdapter } from "./types";

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

  verifyWebhookRequest(headers: Headers, rawBody: string) {
    void headers;
    void rawBody;
    return true;
  },

  parseWebhookPayload() {
    return null;
  },
};
