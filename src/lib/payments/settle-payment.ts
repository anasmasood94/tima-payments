import { InvoiceStatus, OrderStatus, PaymentStatus, type Payment } from "@prisma/client";
import { prisma } from "@/lib/db";
import { revalidatePathsAfterResponse } from "@/lib/revalidate-after-response";

type PaymentWithInvoice = Payment & {
  invoice: { orderId: string };
};

export async function settlePaymentStatus(payment: PaymentWithInvoice, status: PaymentStatus) {
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status },
    });

    if (status === PaymentStatus.SUCCEEDED) {
      await tx.order.update({
        where: { id: payment.invoice.orderId },
        data: { status: OrderStatus.PAID },
      });
      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: InvoiceStatus.ISSUED },
      });
    }

    if (status === PaymentStatus.REFUNDED) {
      await tx.order.update({
        where: { id: payment.invoice.orderId },
        data: { status: OrderStatus.INVOICED },
      });
    }
  });

  if (status === PaymentStatus.SUCCEEDED) {
    revalidatePathsAfterResponse(["/portal", "/admin", `/portal/orders/${payment.invoice.orderId}`]);
  }
  if (status === PaymentStatus.REFUNDED) {
    revalidatePathsAfterResponse(["/portal", `/portal/orders/${payment.invoice.orderId}`]);
  }
}
