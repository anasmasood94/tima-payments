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
        <h1 className="text-2xl font-semibold text-ink">{invoiceNumber}</h1>
        <p className="mt-1 text-sm text-body">
          {orderPaid ? (
            <>
              {t.portalInvoice.total} {formatUsd(amountCents)} ·{" "}
              <span className="font-medium text-emerald-700">{t.portalInvoice.paidInFull}</span>
              {invoiceStatus === "ISSUED" ? (
                <span className="text-muted"> · {t.portalInvoice.invoice} {invoiceStatus.toLowerCase()}</span>
              ) : null}
            </>
          ) : (
            <>
              {t.portalInvoice.amountDue} {formatUsd(amountCents)} · {invoiceStatus}
              {dueAt ? ` · ${t.portalInvoice.due} ${dueAt}` : null}
            </>
          )}
        </p>
        {amountDiffersFromLines ? (
          <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {t.portalInvoice.catalogSubtotalWas} {formatUsd(lineSubtotalCents)}. {t.portalInvoice.adjustedTotal}
          </p>
        ) : null}
      </div>

      {isDraftPlaced ? (
        <p className="rounded-lg border border-line bg-panel p-4 text-sm text-ink">
          {t.portalInvoice.draftOrderPrompt}{" "}
          <Link href={`/portal/orders/${orderId}`} className="font-medium underline">
            {t.portalInvoice.openOrder}
          </Link>{" "}
          {t.portalInvoice.useContinueCheckout}
        </p>
      ) : null}

      {canPay ? (
        <InvoicePayForm invoiceId={invoiceId} />
      ) : isDraftPlaced ? null : orderPaid ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-medium">{t.portalInvoice.noPaymentRequired}</p>
          <p className="mt-2 text-emerald-900">
            <Link href={`/portal/orders/${orderId}`} className="font-semibold underline">
              {t.portalInvoice.viewOrder}
            </Link>{" "}
            {t.portalInvoice.viewOrderSuffix}
          </p>
        </div>
      ) : (
        <p className="text-sm text-body">{t.portalInvoice.notAvailable}</p>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.portalInvoice.paymentAttempts}</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-body">{t.portalInvoice.noneYet}</p>
        ) : (
          <ul className="space-y-1 text-sm text-body">
            {payments.map((p) => (
              <li key={p.id}>
                {p.gateway} · {p.status}
                {p.providerPaymentId ? ` · ${t.portalInvoice.ref} ${p.providerPaymentId}` : null} · {p.createdAt}
              </li>
            ))}
          </ul>
        )}
      </section>

      {latestPendingCheckoutUrl ? (
        <p className="text-sm text-body">
          {t.portalInvoice.resumePrompt}{" "}
          <a href={latestPendingCheckoutUrl} className="font-medium underline">
            {t.portalInvoice.resumeLink}
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
