import type { PaymentGatewayId, PaymentStatus } from "@prisma/client";

export type HostedCheckoutInput = {
  paymentId: string;
  amountCents: number;
  currency: string;
  customerEmail: string;
  returnUrl: string;
  cancelUrl: string;
  /** Set for post–admin-invoice checkout. */
  invoiceId?: string;
  invoiceNumber?: string;
  /** Set for immediate catalog checkout — PSP metadata / analytics. */
  orderId?: string;
};

export type HostedCheckoutOutput = {
  hostedCheckoutUrl: string;
  providerPaymentId: string | null;
  metadata?: Record<string, unknown>;
};

export type NormalizedWebhookPayment = {
  providerPaymentId: string;
  status: PaymentStatus;
};

export type RefundInput = {
  providerPaymentId: string;
  amountCents: number;
  currency: string;
  reason?: string;
};

export type RefundOutput = {
  success: boolean;
  providerRefundId: string | null;
  error?: string;
};

export interface PaymentGatewayAdapter {
  readonly gatewayId: PaymentGatewayId;
  createHostedCheckout(input: HostedCheckoutInput): Promise<HostedCheckoutOutput>;
  /** Return true if the request should be processed (signature valid or dev mode). */
  verifyWebhookRequest(headers: Headers, rawBody: string): boolean;
  /** Parse provider JSON body into a normalized payment update, or null if ignored. */
  parseWebhookPayload(rawBody: unknown): NormalizedWebhookPayment | null;
  refundPayment?(input: RefundInput): Promise<RefundOutput>;
}
