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
  const orderPaid = invoice.order.status === OrderStatus.PAID;
  const canPay =
    invoice.status === InvoiceStatus.ISSUED && invoice.order.status !== OrderStatus.PAID;
  const lineSubtotalCents = invoice.order.lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const amountDiffersFromLines = lineSubtotalCents !== invoice.amountCents;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{invoice.number}</h1>
        <p className="mt-1 text-sm text-body">
          {orderPaid ? (
            <>
              Total {formatUsd(invoice.amountCents)} ·{" "}
              <span className="font-medium text-emerald-700">Paid in full</span>
              {invoice.status === InvoiceStatus.ISSUED ? (
                <span className="text-muted"> · Invoice {invoice.status.toLowerCase()}</span>
              ) : null}
            </>
          ) : (
            <>
              Amount due {formatUsd(invoice.amountCents)} · {invoice.status}
              {invoice.dueAt ? ` · Due ${invoice.dueAt.toLocaleDateString()}` : null}
            </>
          )}
        </p>
        {amountDiffersFromLines ? (
          <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            Catalog line subtotal was {formatUsd(lineSubtotalCents)}. This invoice reflects an adjusted total (quote,
            fees, or admin override) — pay the amount due above.
          </p>
        ) : null}
      </div>

      {invoice.status === InvoiceStatus.DRAFT && invoice.order.status === OrderStatus.PLACED ? (
        <p className="rounded-lg border border-line bg-panel p-4 text-sm text-ink">
          This invoice is tied to a new order that still needs checkout.{" "}
          <Link href={`/portal/orders/${invoice.orderId}`} className="font-medium underline">
            Open your order
          </Link>{" "}
          and use <strong>Continue to checkout</strong>.
        </p>
      ) : null}

      {canPay ? (
        <InvoicePayForm invoiceId={invoice.id} />
      ) : invoice.status === InvoiceStatus.DRAFT && invoice.order.status === OrderStatus.PLACED ? null : orderPaid ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-medium">No further payment is required.</p>
          <p className="mt-2 text-emerald-900">
            <Link href={`/portal/orders/${invoice.orderId}`} className="font-semibold underline">
              View your order
            </Link>{" "}
            for line items and confirmation.
          </p>
        </div>
      ) : (
        <p className="text-sm text-body">This invoice is not available for online payment.</p>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Payment attempts</h2>
        {invoice.payments.length === 0 ? (
          <p className="text-sm text-body">None yet.</p>
        ) : (
          <ul className="space-y-1 text-sm text-body">
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
        <p className="text-sm text-body">
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
