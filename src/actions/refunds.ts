"use server";

import { PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { getAdapterByGatewayId } from "@/lib/payments/registry";
import { settlePaymentStatus } from "@/lib/payments/settle-payment";

const refundSchema = z.object({
  paymentId: z.string().min(1).max(64),
});

export async function refundPaymentAction(_prev: unknown, formData: FormData) {
  await requireAdmin();

  const parsed = refundSchema.safeParse({ paymentId: formData.get("paymentId") });
  if (!parsed.success) {
    return { error: "Missing payment ID." };
  }
  const { paymentId } = parsed.data;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { invoice: { select: { orderId: true } } },
  });

  if (!payment) {
    return { error: "Payment not found." };
  }

  if (payment.status !== PaymentStatus.SUCCEEDED) {
    return { error: "Only succeeded payments can be refunded." };
  }

  if (!payment.providerPaymentId) {
    return { error: "Payment has no provider reference." };
  }

  const adapter = getAdapterByGatewayId(payment.gateway);

  if (!adapter.refundPayment) {
    return { error: "Refunds not supported for this gateway." };
  }

  const result = await adapter.refundPayment({
    providerPaymentId: payment.providerPaymentId,
    amountCents: payment.amountCents,
    currency: payment.currency,
    reason: "admin_refund",
  });

  if (!result.success) {
    return { error: result.error ?? "Refund failed at provider." };
  }

  await settlePaymentStatus(payment, PaymentStatus.REFUNDED);

  revalidatePath("/admin");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");

  return { ok: true };
}
