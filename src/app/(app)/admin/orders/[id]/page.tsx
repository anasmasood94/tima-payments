import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { orderStatusLabel } from "@/lib/order-status";
import { IssueInvoiceModalTrigger } from "./issue-invoice-modal-trigger";

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
    <div className="space-y-8">
      <Link href="/admin/orders" className="text-sm text-zinc-600 underline">
        ← Orders
      </Link>
      {sp.issued ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Invoice issued.
        </p>
      ) : null}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Order detail</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {order.user.name} · {order.user.email} · {orderStatusLabel(order.status)}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase text-zinc-600">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Line</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {order.lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-2">{line.product.name}</td>
                <td className="px-4 py-2">{line.quantity}</td>
                <td className="px-4 py-2">{formatUsd(line.unitPriceCents)}</td>
                <td className="px-4 py-2">{formatUsd(line.quantity * line.unitPriceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm font-medium">Subtotal {formatUsd(subtotal)}</p>

      {order.notes ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm">
          <p className="text-xs font-medium uppercase text-zinc-500">Customer notes</p>
          <p className="mt-1 whitespace-pre-wrap">{order.notes}</p>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">Invoices</h2>
          {canIssue ? <IssueInvoiceModalTrigger orderId={order.id} computedSubtotalCents={subtotal} /> : null}
        </div>
        {order.invoices.length === 0 ? (
          <p className="text-sm text-zinc-600">No invoices yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {order.invoices.map((inv) => (
              <li key={inv.id}>
                <Link href="/admin/invoices" className="underline">
                  {inv.number}
                </Link>{" "}
                — {formatUsd(inv.amountCents)} · {inv.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
