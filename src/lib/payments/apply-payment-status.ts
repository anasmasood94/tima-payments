import { type PaymentGatewayId, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { settlePaymentStatus } from "./settle-payment";

/**
 * Idempotent payment status update from webhooks.
 * Card data is never stored; only provider references and status transitions.
 */
export async function applyPaymentStatusByProviderRef(params: {
  gatewayId: PaymentGatewayId;
  providerPaymentId: string;
  status: PaymentStatus;
}) {
  const { gatewayId, providerPaymentId, status } = params;

  const payment = await prisma.payment.findFirst({
    where: { gateway: gatewayId, providerPaymentId },
    include: { invoice: { select: { orderId: true } } },
  });

  if (!payment) {
    if (status === PaymentStatus.REFUNDED) {
      console.warn(
        `[applyPaymentStatus] REFUNDED webhook could not find payment: gateway=${gatewayId} providerPaymentId=${providerPaymentId}. ` +
        `The PSP may have sent a refund-specific reference instead of the original checkout reference.`,
      );
    }
    return { ok: false as const, reason: "payment_not_found" };
  }

  if (payment.status === status) {
    return { ok: true as const, paymentId: payment.id, duplicate: true };
  }

  await settlePaymentStatus(
    { ...payment, invoice: { orderId: payment.invoice.orderId } },
    status,
  );

  return { ok: true as const, paymentId: payment.id };
}

export async function applyPaymentStatusByIdForUser(params: {
  paymentId: string;
  userId: string;
  status: PaymentStatus;
}) {
  const payment = await prisma.payment.findFirst({
    where: {
      id: params.paymentId,
      invoice: { order: { userId: params.userId } },
    },
    include: { invoice: { select: { orderId: true } } },
  });

  if (!payment) {
    return { ok: false as const, reason: "payment_not_found" };
  }

  if (payment.status === params.status) {
    return {
      ok: true as const,
      paymentId: payment.id,
      orderId: payment.invoice.orderId,
      duplicate: true,
    };
  }

  await settlePaymentStatus(
    { ...payment, invoice: { orderId: payment.invoice.orderId } },
    params.status,
  );

  return { ok: true as const, paymentId: payment.id, orderId: payment.invoice.orderId };
}
