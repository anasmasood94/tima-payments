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

function statusColor(status: OrderStatus) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "PLACED":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "CONFIRMED":
      return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";
    case "INVOICED":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "QUOTE_REQUESTED":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";
    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
            <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-ink">{t.portalOrder.title}</h1>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor(orderStatus)}`}>
            {orderStatusLabel(orderStatus, t.orderStatus)}
          </span>
          <span className="text-sm text-muted">{createdAt}</span>
        </div>
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
        <div className="rounded-xl border border-brand/30 bg-gradient-to-r from-brand to-brand-dark p-5 text-white shadow-md shadow-brand/10">
          <p className="text-sm font-medium uppercase tracking-wide text-white/75">{t.portalOrder.checkout}</p>
          <p className="mt-1 text-lg font-semibold">
            {t.paymentFlow.pay} {formatUsd(pendingPayment.amountCents)} {t.portalOrder.payToConfirm}
          </p>
          <p className="mt-2 text-sm text-white/80">
            {t.portalOrder.paymentRedirect}
          </p>
          <a
            href={pendingPayment.hostedCheckoutUrl}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-sm transition-colors hover:bg-brand/5"
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
        <div className="rounded-lg border border-line bg-white p-4 text-sm shadow-sm">
          <p className="text-xs font-medium uppercase text-muted">{t.portalOrder.notes}</p>
          <p className="mt-1 whitespace-pre-wrap text-ink">{notes}</p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-line shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-brand/5 to-transparent text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.portalOrder.item}</th>
              <th className="px-4 py-3 font-semibold">{t.portalOrder.qty}</th>
              <th className="px-4 py-3 font-semibold">{t.portalOrder.unit}</th>
              <th className="px-4 py-3 font-semibold">{t.portalOrder.line}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {lines.map((line) => (
              <tr key={line.id} className="transition-colors hover:bg-brand/[0.02]">
                <td className="px-4 py-3 font-medium text-ink">{line.productName}</td>
                <td className="px-4 py-3">{line.quantity}</td>
                <td className="px-4 py-3">{formatUsd(line.unitPriceCents)}</td>
                <td className="px-4 py-3 font-medium">{formatUsd(line.quantity * line.unitPriceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2 rounded-lg bg-brand/5 px-4 py-3">
        <span className="text-sm text-body">{t.portalOrder.subtotal}</span>
        <span className="text-lg font-semibold text-ink">{formatUsd(subtotalCents)}</span>
      </div>

      {invoices.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
              <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-ink">{t.portalOrder.invoicesHeading}</h2>
          </div>
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li key={inv.id} className="rounded-lg border border-line bg-white px-4 py-3 text-sm shadow-sm">
                {inv.status === "DRAFT" ? (
                  <span className="text-body">
                    {inv.number} — {formatUsd(inv.amountCents)} · <span className="italic">{t.portalOrder.checkoutPending}</span>
                  </span>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <Link href={`/portal/invoices/${inv.id}`} className="font-medium text-brand underline transition-colors hover:text-brand-dark">
                        {inv.number} — {formatUsd(inv.amountCents)}
                      </Link>
                      <span className="ml-2 inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {inv.status}
                      </span>
                    </div>
                    {inv.status === "ISSUED" && orderStatus !== "PAID" ? (
                      <span className="text-xs text-body">{t.portalOrder.payFromInvoice}</span>
                    ) : null}
                  </div>
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
