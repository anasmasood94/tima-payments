import Link from "next/link";
import { redirect } from "next/navigation";
import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { orderStatusLabel } from "@/lib/order-status";
import {
  PortalHeading,
  PortalSectionTitle,
  PortalEmptyText,
  PortalViewLink,
  PortalOpenLink,
} from "./portal-heading";

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

  const [orders, invoices] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { lines: { include: { product: true } }, invoices: true },
    }),
    prisma.invoice.findMany({
      where: {
        order: { userId: session.sub },
        status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.VOID] },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { order: true },
    }),
  ]);

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

      <section className="space-y-3">
        <PortalSectionTitle section="recentOrders" />
        {orders.length === 0 ? (
          <PortalEmptyText type="orders" />
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{orderStatusLabel(o.status)}</p>
                  <p className="text-xs text-muted">
                    {o.lines.length} line(s) · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/portal/orders/${o.id}`} className="text-sm font-medium text-ink underline">
                  <PortalViewLink />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <PortalSectionTitle section="invoices" />
        {invoices.length === 0 ? (
          <PortalEmptyText type="invoices" />
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{inv.number}</p>
                  <p className="text-xs text-muted">
                    {formatUsd(inv.amountCents)} · {inv.status}
                  </p>
                </div>
                <Link href={`/portal/invoices/${inv.id}`} className="text-sm font-medium text-ink underline">
                  <PortalOpenLink />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
