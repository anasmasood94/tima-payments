import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { InvoiceStatus, OrderStatus, PaymentGatewayId, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { orderStatusDescription, orderStatusLabel } from "@/lib/order-status";
import { syncAirwallexPaymentsForOrderAction } from "@/actions/payments";
import { AirwallexOrderPaymentPoller } from "./airwallex-order-payment-poller";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string; checkout?: string }>;
};

function pendingHostedPayment(order: {
  status: OrderStatus;
  invoices: {
    payments: {
      status: PaymentStatus;
      hostedCheckoutUrl: string | null;
      gateway: PaymentGatewayId;
      providerPaymentId: string | null;
      amountCents: number;
    }[];
  }[];
}) {
  return order.invoices
    .flatMap((inv) => inv.payments)
    .find((p) => p.status === PaymentStatus.PENDING && p.hostedCheckoutUrl);
}

function shouldReconcileAirwallexOnLoad(order: {
  status: OrderStatus;
  invoices: { payments: { status: PaymentStatus; gateway: PaymentGatewayId; providerPaymentId: string | null }[] }[];
}) {
  if (order.status !== OrderStatus.PLACED) return false;
  return order.invoices
    .flatMap((inv) => inv.payments)
    .some(
      (p) =>
        (p.status === PaymentStatus.PENDING || p.status === PaymentStatus.PROCESSING) &&
        p.gateway === PaymentGatewayId.AIRWALLEX &&
        Boolean(p.providerPaymentId) &&
        !p.providerPaymentId!.startsWith("awx_stub_"),
    );
}

export default async function PortalOrderDetailPage({ params, searchParams }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { id } = await params;
  const sp = await searchParams;

  let order = await prisma.order.findFirst({
    where: { id, userId: session.sub },
    include: {
      lines: { include: { product: true } },
      invoices: { include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } } },
    },
  });

  if (!order) {
    notFound();
  }

  if (shouldReconcileAirwallexOnLoad(order)) {
    await syncAirwallexPaymentsForOrderAction(id);
    order = await prisma.order.findFirst({
      where: { id, userId: session.sub },
      include: {
        lines: { include: { product: true } },
        invoices: { include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } } },
      },
    });
    if (!order) {
      notFound();
    }
  }

  if (sp.checkout === "complete" && order.status === OrderStatus.PAID) {
    redirect(`/portal/orders/${id}?paid=1`);
  }

  const subtotal = order.lines.reduce((s, l) => s + l.quantity * l.unitPriceCents, 0);
  const pendingPayment = pendingHostedPayment(order);
  const checkoutReturned = sp.checkout === "complete" || sp.checkout === "cancelled";

  const pollAirwallex =
    checkoutReturned &&
    order.status === OrderStatus.PLACED &&
    pendingPayment != null &&
    pendingPayment.gateway === PaymentGatewayId.AIRWALLEX &&
    pendingPayment.providerPaymentId != null &&
    !pendingPayment.providerPaymentId.startsWith("awx_stub_");

  const hasAnyHostedCheckoutUrl = order.invoices
    .flatMap((inv) => inv.payments)
    .some((p) => Boolean(p.hostedCheckoutUrl));

  return (
    <div className="space-y-6">
      <Link href="/portal" className="text-sm text-body underline">
        ← My account
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-ink">Order</h1>
        <p className="mt-1 text-sm text-body">
          <span className="font-medium text-ink">{orderStatusLabel(order.status)}</span>
          <span className="text-muted/70"> · </span>
          <span className="text-body">{new Date(order.createdAt).toLocaleString()}</span>
        </p>
        {orderStatusDescription(order.status) ? (
          <p className="mt-2 text-sm text-body">{orderStatusDescription(order.status)}</p>
        ) : null}
      </div>

      {sp.paid ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          Thank you — your payment was recorded and this order is now <strong>paid</strong>.
        </p>
      ) : null}

      {sp.checkout === "complete" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          If you just finished paying with your bank or card provider, this page will update to <strong>Paid</strong>{" "}
          automatically within a few seconds once we confirm with Airwallex (or you can refresh).
        </p>
      ) : null}

      {sp.checkout === "cancelled" ? (
        <p className="rounded-lg border border-line bg-panel p-3 text-sm text-ink">
          If you left checkout or the payment did not go through, we will refresh the status from Airwallex here. You
          can use <strong>Continue to checkout</strong> below to try again if the order is still unpaid.
        </p>
      ) : null}

      <AirwallexOrderPaymentPoller orderId={order.id} enabled={pollAirwallex} />

      {order.status === OrderStatus.PLACED && pendingPayment?.hostedCheckoutUrl ? (
        <div className="rounded-xl border border-brick/30 bg-brick p-5 text-white shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-white/75">Checkout</p>
          <p className="mt-1 text-lg font-semibold">Pay {formatUsd(pendingPayment.amountCents)} to confirm this order</p>
          <p className="mt-2 text-sm text-white/80">
            You will leave this site for secure hosted payment ({pendingPayment.gateway}). Card details are never
            entered here.
          </p>
          <a
            href={pendingPayment.hostedCheckoutUrl}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-panel"
          >
            Continue to checkout
          </a>
        </div>
      ) : null}

      {order.status === OrderStatus.PLACED && !pendingPayment?.hostedCheckoutUrl && !hasAnyHostedCheckoutUrl ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          Checkout could not be started. Please contact support with your order reference.
        </p>
      ) : null}

      {order.status === OrderStatus.QUOTE_REQUESTED ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          This is a <strong>quote request</strong>. Line totals below use list pricing as a guide; the amount due will
          appear on your invoice after we review the request.
        </p>
      ) : null}
      {order.notes ? (
        <div className="rounded-lg border border-line bg-white p-4 text-sm">
          <p className="text-xs font-medium uppercase text-muted">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-ink">{order.notes}</p>
        </div>
      ) : null}
      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Line</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {order.lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-2 text-ink">{line.product.name}</td>
                <td className="px-4 py-2">{line.quantity}</td>
                <td className="px-4 py-2">{formatUsd(line.unitPriceCents)}</td>
                <td className="px-4 py-2">{formatUsd(line.quantity * line.unitPriceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm font-medium text-ink">Subtotal {formatUsd(subtotal)}</p>

      {order.invoices.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">Invoices</h2>
          <ul className="space-y-2">
            {order.invoices.map((inv) => (
              <li key={inv.id} className="text-sm">
                {inv.status === InvoiceStatus.DRAFT ? (
                  <span className="text-body">
                    {inv.number} — {formatUsd(inv.amountCents)} · <span className="italic">Checkout pending</span>
                  </span>
                ) : (
                  <>
                    <Link href={`/portal/invoices/${inv.id}`} className="font-medium text-ink underline">
                      {inv.number} — {formatUsd(inv.amountCents)}
                    </Link>
                    <span className="text-muted"> · {inv.status}</span>
                    {inv.status === InvoiceStatus.ISSUED && order.status !== OrderStatus.PAID ? (
                      <span className="text-body">
                        {" "}
                        — open the invoice to use <strong>Pay with hosted checkout</strong> for any balance due.
                      </span>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : order.status === OrderStatus.INVOICED || order.status === OrderStatus.CONFIRMED ? (
        <p className="rounded-lg border border-line bg-panel p-3 text-sm text-body">
          When an invoice appears here, you can pay it with hosted checkout from the invoice page.
        </p>
      ) : null}
    </div>
  );
}
