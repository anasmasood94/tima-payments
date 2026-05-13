import { notFound, redirect } from "next/navigation";
import { InvoiceStatus, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { InvoiceDetailContent } from "./invoice-detail-content";

type Props = { params: Promise<{ id: string }> };

export default async function PortalInvoicePage({ params }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, order: { userId: session.sub } },
    include: {
      order: { include: { lines: { include: { product: true } } } },
      payments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!invoice) {
    notFound();
  }

  const latest = invoice.payments[0];
  const orderPaid = invoice.order.status === OrderStatus.PAID;
  const canPay =
    invoice.status === InvoiceStatus.ISSUED && invoice.order.status !== OrderStatus.PAID;
  const lineSubtotalCents = invoice.order.lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const amountDiffersFromLines = lineSubtotalCents !== invoice.amountCents;
  const isDraftPlaced = invoice.status === InvoiceStatus.DRAFT && invoice.order.status === OrderStatus.PLACED;

  return (
    <InvoiceDetailContent
      invoiceNumber={invoice.number}
      invoiceId={invoice.id}
      amountCents={invoice.amountCents}
      invoiceStatus={invoice.status}
      dueAt={invoice.dueAt ? invoice.dueAt.toLocaleDateString() : null}
      orderId={invoice.orderId}
      orderStatus={invoice.order.status}
      lineSubtotalCents={lineSubtotalCents}
      amountDiffersFromLines={amountDiffersFromLines}
      canPay={canPay}
      orderPaid={orderPaid}
      isDraftPlaced={isDraftPlaced}
      payments={invoice.payments.map((p) => ({
        id: p.id,
        gateway: p.gateway,
        status: p.status,
        providerPaymentId: p.providerPaymentId,
        createdAt: new Date(p.createdAt).toLocaleString(),
        hostedCheckoutUrl: p.hostedCheckoutUrl,
      }))}
      latestPendingCheckoutUrl={
        latest?.hostedCheckoutUrl && latest.status === "PENDING" ? latest.hostedCheckoutUrl : null
      }
    />
  );
}
