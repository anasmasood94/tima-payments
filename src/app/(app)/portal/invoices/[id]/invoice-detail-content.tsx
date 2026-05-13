"use client";

import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { useTranslation } from "@/lib/i18n/language-context";
import { InvoicePayForm } from "./invoice-pay-form";

type PaymentData = {
  id: string;
  gateway: string;
  status: string;
  providerPaymentId: string | null;
  createdAt: string;
  hostedCheckoutUrl: string | null;
};

type Props = {
  csrfToken: string;
  invoiceNumber: string;
  invoiceId: string;
  amountCents: number;
  invoiceStatus: string;
  dueAt: string | null;
  orderId: string;
  orderStatus: string;
  lineSubtotalCents: number;
  amountDiffersFromLines: boolean;
  canPay: boolean;
  orderPaid: boolean;
  isDraftPlaced: boolean;
  payments: PaymentData[];
  latestPendingCheckoutUrl: string | null;
};

export function InvoiceDetailContent({
  csrfToken,
  invoiceNumber,
  invoiceId,
  amountCents,
  invoiceStatus,
  dueAt,
  orderId,
  orderStatus,
  lineSubtotalCents,
  amountDiffersFromLines,
  canPay,
  orderPaid,
  isDraftPlaced,
  payments,
  latestPendingCheckoutUrl,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
            <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-ink">{invoiceNumber}</h1>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {orderPaid ? (
            <>
              <span className="text-sm text-body">{t.portalInvoice.total} {formatUsd(amountCents)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {t.portalInvoice.paidInFull}
              </span>
              {invoiceStatus === "ISSUED" ? (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  {t.portalInvoice.invoice} {invoiceStatus.toLowerCase()}
                </span>
              ) : null}
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-ink">{t.portalInvoice.amountDue} {formatUsd(amountCents)}</span>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                {invoiceStatus}
              </span>
              {dueAt ? <span className="text-sm text-muted">{t.portalInvoice.due} {dueAt}</span> : null}
            </>
          )}
        </div>
        {amountDiffersFromLines ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {t.portalInvoice.catalogSubtotalWas} {formatUsd(lineSubtotalCents)}. {t.portalInvoice.adjustedTotal}
          </p>
        ) : null}
      </div>

      {isDraftPlaced ? (
        <p className="rounded-lg border border-line bg-panel p-4 text-sm text-ink">
          {t.portalInvoice.draftOrderPrompt}{" "}
          <Link href={`/portal/orders/${orderId}`} className="font-medium text-brand underline transition-colors hover:text-brand-dark">
            {t.portalInvoice.openOrder}
          </Link>{" "}
          {t.portalInvoice.useContinueCheckout}
        </p>
      ) : null}

      {canPay ? (
        <InvoicePayForm invoiceId={invoiceId} csrfToken={csrfToken} />
      ) : isDraftPlaced ? null : orderPaid ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-medium">{t.portalInvoice.noPaymentRequired}</p>
          <p className="mt-2 text-emerald-900">
            <Link href={`/portal/orders/${orderId}`} className="font-semibold text-emerald-700 underline transition-colors hover:text-emerald-900">
              {t.portalInvoice.viewOrder}
            </Link>{" "}
            {t.portalInvoice.viewOrderSuffix}
          </p>
        </div>
      ) : (
        <p className="text-sm text-body">{t.portalInvoice.notAvailable}</p>
      )}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
            <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.portalInvoice.paymentAttempts}</h2>
        </div>
        {payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-6 text-center">
            <p className="text-sm text-body">{t.portalInvoice.noneYet}</p>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm">
            {payments.map((p) => {
              const isPaid = p.status.toUpperCase() === "PAID" || p.status.toUpperCase() === "SUCCEEDED";
              const isFailed = p.status.toUpperCase() === "FAILED" || p.status.toUpperCase() === "CANCELLED";
              const statusStyle = isPaid
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                : isFailed
                  ? "bg-red-50 text-red-700 ring-red-600/20"
                  : "bg-amber-50 text-amber-700 ring-amber-600/20";

              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">{p.gateway}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted">
                    {p.providerPaymentId ? <span>{t.portalInvoice.ref} {p.providerPaymentId} · </span> : null}
                    {p.createdAt}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {latestPendingCheckoutUrl ? (
        <p className="text-sm text-body">
          {t.portalInvoice.resumePrompt}{" "}
          <a href={latestPendingCheckoutUrl} className="font-medium text-brand underline transition-colors hover:text-brand-dark">
            {t.portalInvoice.resumeLink}
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
