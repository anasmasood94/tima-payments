import { redirect } from "next/navigation";
import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { PortalHeading } from "./portal-heading";
import { PortalOrdersList, PortalInvoicesList } from "./portal-lists";
import { PortalStatusMessages } from "./portal-status-messages";

export const metadata = { title: "My account" };

export default async function PortalHomePage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; paid?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const sp = await searchParams;

  const [rawOrders, rawInvoices] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      include: { lines: { include: { product: true } }, invoices: true },
    }),
    prisma.invoice.findMany({
      where: {
        order: { userId: session.sub },
        status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.VOID] },
      },
      orderBy: { createdAt: "desc" },
      include: { order: true },
    }),
  ]);

  const orders = rawOrders.map((o) => ({
    id: o.id,
    status: o.status,
    lineCount: o.lines.length,
    createdAt: new Date(o.createdAt).toLocaleDateString(),
  }));

  const invoices = rawInvoices.map((inv) => ({
    id: inv.id,
    number: inv.number,
    amount: formatUsd(inv.amountCents),
    status: inv.status,
  }));

  return (
    <div className="space-y-10">
      <div>
        <PortalHeading />
        <PortalStatusMessages created={!!sp.created} paid={!!sp.paid} />
      </div>

      <PortalOrdersList orders={orders} />
      <PortalInvoicesList invoices={invoices} />
    </div>
  );
}
