"use client";

import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { orderStatusLabel, orderStatusDescription } from "@/lib/order-status";
import { useTranslation } from "@/lib/i18n/language-context";
import { AirwallexOrderPaymentPoller } from "./airwallex-order-payment-poller";
import type { OrderStatus, InvoiceStatus } from "@prisma/client";

type InvoiceData = {
  id: string;
  number: string;
  amountCents: number;
  status: string;
};

type PendingPaymentData = {
  hostedCheckoutUrl: string;
  amountCents: number;
  gateway: string;
} | null;

type OrderLine = {
  id: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
};

type Props = {
  orderId: string;
  orderStatus: OrderStatus;
  createdAt: string;
  notes: string | null;
  lines: OrderLine[];
  subtotalCents: number;
  invoices: InvoiceData[];
  pendingPayment: PendingPaymentData;
  hasAnyHostedCheckoutUrl: boolean;
  pollAirwallex: boolean;
  paid: boolean;
  checkoutComplete: boolean;
  checkoutCancelled: boolean;
};

export function OrderDetailContent({
  orderId,
  orderStatus,
  createdAt,
  notes,
  lines,
  subtotalCents,
  invoices,
  pendingPayment,
  hasAnyHostedCheckoutUrl,
  pollAirwallex,
  paid,
  checkoutComplete,
  checkoutCancelled,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.portalOrder.title}</h1>
        <p className="mt-1 text-sm text-body">
          <span className="font-medium text-ink">{orderStatusLabel(orderStatus, t.orderStatus)}</span>
          <span className="text-muted/70"> · </span>
          <span className="text-body">{createdAt}</span>
        </p>
        {orderStatusDescription(orderStatus, t.orderStatus) ? (
          <p className="mt-2 text-sm text-body">{orderStatusDescription(orderStatus, t.orderStatus)}</p>
        ) : null}
      </div>

      {paid ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          {t.portalOrder.paymentRecorded}
        </p>
      ) : null}

      {checkoutComplete ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          {t.portalOrder.checkoutComplete}
        </p>
      ) : null}

      {checkoutCancelled ? (
        <p className="rounded-lg border border-line bg-panel p-3 text-sm text-ink">
          {t.portalOrder.checkoutCancelled}
        </p>
      ) : null}

      <AirwallexOrderPaymentPoller orderId={orderId} enabled={pollAirwallex} />

      {orderStatus === "PLACED" && pendingPayment?.hostedCheckoutUrl ? (
        <div className="rounded-xl border border-brand/30 bg-brand p-5 text-white shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-white/75">{t.portalOrder.checkout}</p>
          <p className="mt-1 text-lg font-semibold">
            {t.paymentFlow.pay} {formatUsd(pendingPayment.amountCents)} {t.portalOrder.payToConfirm}
          </p>
          <p className="mt-2 text-sm text-white/80">
            {t.portalOrder.paymentRedirect}
          </p>
          <a
            href={pendingPayment.hostedCheckoutUrl}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-panel"
          >
            {t.portalOrder.continueCheckout}
          </a>
        </div>
      ) : null}

      {orderStatus === "PLACED" && !pendingPayment?.hostedCheckoutUrl && !hasAnyHostedCheckoutUrl ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          {t.portalOrder.checkoutError}
        </p>
      ) : null}

      {orderStatus === "QUOTE_REQUESTED" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          {t.portalOrder.quoteNote}
        </p>
      ) : null}

      {notes ? (
        <div className="rounded-lg border border-line bg-white p-4 text-sm">
          <p className="text-xs font-medium uppercase text-muted">{t.portalOrder.notes}</p>
          <p className="mt-1 whitespace-pre-wrap text-ink">{notes}</p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">{t.portalOrder.item}</th>
              <th className="px-4 py-2">{t.portalOrder.qty}</th>
              <th className="px-4 py-2">{t.portalOrder.unit}</th>
              <th className="px-4 py-2">{t.portalOrder.line}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-2 text-ink">{line.productName}</td>
                <td className="px-4 py-2">{line.quantity}</td>
                <td className="px-4 py-2">{formatUsd(line.unitPriceCents)}</td>
                <td className="px-4 py-2">{formatUsd(line.quantity * line.unitPriceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm font-medium text-ink">{t.portalOrder.subtotal} {formatUsd(subtotalCents)}</p>

      {invoices.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">{t.portalOrder.invoicesHeading}</h2>
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li key={inv.id} className="text-sm">
                {inv.status === "DRAFT" ? (
                  <span className="text-body">
                    {inv.number} — {formatUsd(inv.amountCents)} · <span className="italic">{t.portalOrder.checkoutPending}</span>
                  </span>
                ) : (
                  <>
                    <Link href={`/portal/invoices/${inv.id}`} className="font-medium text-ink underline">
                      {inv.number} — {formatUsd(inv.amountCents)}
                    </Link>
                    <span className="text-muted"> · {inv.status}</span>
                    {inv.status === "ISSUED" && orderStatus !== "PAID" ? (
                      <span className="text-body"> {t.portalOrder.payFromInvoice}</span>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : orderStatus === "INVOICED" || orderStatus === "CONFIRMED" ? (
        <p className="rounded-lg border border-line bg-panel p-3 text-sm text-body">
          {t.portalOrder.invoicePrompt}
        </p>
      ) : null}
    </div>
  );
}
