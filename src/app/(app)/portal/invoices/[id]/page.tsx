import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { InvoiceStatus, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { InvoicePayForm } from "./invoice-pay-form";

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
  const canPay =
    invoice.status === InvoiceStatus.ISSUED && invoice.order.status !== OrderStatus.PAID;
  const lineSubtotalCents = invoice.order.lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const amountDiffersFromLines = lineSubtotalCents !== invoice.amountCents;

  return (
    <div className="space-y-6">
      <Link href="/portal" className="text-sm text-zinc-600 underline">
        ← Portal
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{invoice.number}</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Amount due {formatUsd(invoice.amountCents)} · {invoice.status}
          {invoice.dueAt ? ` · Due ${invoice.dueAt.toLocaleDateString()}` : null}
        </p>
        {amountDiffersFromLines ? (
          <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            Catalog line subtotal was {formatUsd(lineSubtotalCents)}. This invoice reflects an adjusted total (quote,
            fees, or admin override) — pay the amount due above.
          </p>
        ) : null}
      </div>

      {invoice.status === InvoiceStatus.DRAFT && invoice.order.status === OrderStatus.PLACED ? (
        <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800">
          This invoice is tied to a new order that still needs checkout.{" "}
          <Link href={`/portal/orders/${invoice.orderId}`} className="font-medium underline">
            Open your order
          </Link>{" "}
          and use <strong>Continue to checkout</strong>.
        </p>
      ) : null}

      {canPay ? (
        <InvoicePayForm invoiceId={invoice.id} />
      ) : invoice.status === InvoiceStatus.DRAFT && invoice.order.status === OrderStatus.PLACED ? null : (
        <p className="text-sm text-zinc-600">
          {invoice.order.status === "PAID"
            ? "This order is marked paid."
            : "This invoice is not available for online payment."}
        </p>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Payment attempts</h2>
        {invoice.payments.length === 0 ? (
          <p className="text-sm text-zinc-600">None yet.</p>
        ) : (
          <ul className="space-y-1 text-sm text-zinc-700">
            {invoice.payments.map((p) => (
              <li key={p.id}>
                {p.gateway} · {p.status}
                {p.providerPaymentId ? ` · ref ${p.providerPaymentId}` : null} · {new Date(p.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      {latest?.hostedCheckoutUrl && latest.status === "PENDING" ? (
        <p className="text-sm text-zinc-600">
          If you did not finish checkout, you can{" "}
          <a href={latest.hostedCheckoutUrl} className="font-medium underline">
            resume the hosted session
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
