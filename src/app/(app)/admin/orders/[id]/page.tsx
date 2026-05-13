import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { AdminOrderDetailContent } from "./order-detail-content";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ issued?: string }> };

export default async function AdminOrderDetailPage({ params, searchParams }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const { id } = await params;
  const sp = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, lines: { include: { product: true } }, invoices: true },
  });

  if (!order) {
    notFound();
  }

  const subtotal = order.lines.reduce((s, l) => s + l.quantity * l.unitPriceCents, 0);
  const hasIssuedInvoice = order.invoices.some((i) => i.status === "ISSUED");
  const canIssue =
    order.lines.length > 0 &&
    order.status !== "PAID" &&
    order.status !== "PLACED" &&
    !hasIssuedInvoice;

  return (
    <AdminOrderDetailContent
      orderId={order.id}
      orderStatus={order.status}
      userName={order.user.name}
      userEmail={order.user.email}
      notes={order.notes}
      lines={order.lines.map((l) => ({
        id: l.id,
        productName: l.product.name,
        quantity: l.quantity,
        unitPriceCents: l.unitPriceCents,
      }))}
      subtotalCents={subtotal}
      invoices={order.invoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amountCents: inv.amountCents,
        status: inv.status,
      }))}
      canIssue={canIssue}
      issued={!!sp.issued}
    />
  );
}
