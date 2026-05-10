import Link from "next/link";
import { redirect } from "next/navigation";
import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { orderStatusLabel } from "@/lib/order-status";

export const metadata = { title: "Customer portal" };

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
        <h1 className="text-2xl font-semibold text-zinc-900">Customer portal</h1>
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
        <h2 className="text-lg font-semibold text-zinc-900">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-600">No orders yet. Start from the catalog.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-zinc-900">{orderStatusLabel(o.status)}</p>
                  <p className="text-xs text-zinc-500">
                    {o.lines.length} line(s) · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/portal/orders/${o.id}`} className="text-sm font-medium text-zinc-900 underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Invoices</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-zinc-600">No invoices yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-zinc-900">{inv.number}</p>
                  <p className="text-xs text-zinc-500">
                    {formatUsd(inv.amountCents)} · {inv.status}
                  </p>
                </div>
                <Link href={`/portal/invoices/${inv.id}`} className="text-sm font-medium text-zinc-900 underline">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
