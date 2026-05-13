import { redirect } from "next/navigation";
import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { orderStatusLabel } from "@/lib/order-status";
import { PortalHeading } from "./portal-heading";
import { PortalOrdersList, PortalInvoicesList } from "./portal-lists";

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
    status: orderStatusLabel(o.status),
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
        {sp.created ? (
          <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
            <p className="font-medium text-emerald-900">Your request was submitted.</p>
            <p className="mt-2 text-emerald-900">
              When an invoice is ready, open it from the list below and use{" "}
              <strong>Pay with hosted checkout</strong> to complete payment on your provider&apos;s site (no card data
              stored here).
            </p>
          </div>
        ) : null}
        {sp.paid ? <p className="mt-2 text-sm text-emerald-700">Thank you — payment recorded.</p> : null}
      </div>

      <PortalOrdersList orders={orders} />
      <PortalInvoicesList invoices={invoices} />
    </div>
  );
}
