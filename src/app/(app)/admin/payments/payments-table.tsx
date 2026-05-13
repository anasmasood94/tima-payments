"use client";

import { useActionState, useCallback } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";
import { refundPaymentAction } from "@/actions/refunds";

export type PaymentRow = {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  gateway: string;
  status: string;
  amount: string;
  providerRef: string;
};

function paymentStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "SUCCEEDED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "FAILED":
      return "bg-red-50 text-red-700 ring-red-600/20";
    case "REFUNDED":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

function RefundButton({ paymentId }: { paymentId: string }) {
  const { t } = useTranslation();
  const [state, action] = useActionState(
    refundPaymentAction,
    null as { ok?: boolean; error?: string } | null,
  );

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(t.admin.refundConfirm)) e.preventDefault();
      }}
    >
      <input type="hidden" name="paymentId" value={paymentId} />
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-xs text-green-600">{t.admin.refundSuccess}</p>}
      {!state?.ok && (
        <button
          type="submit"
          className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
        >
          {t.admin.refund}
        </button>
      )}
    </form>
  );
}

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  const { t } = useTranslation();

  const searchFn = useCallback(
    (p: PaymentRow, q: string) =>
      p.customerName.toLowerCase().includes(q) ||
      p.customerEmail.toLowerCase().includes(q) ||
      p.gateway.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      p.providerRef.toLowerCase().includes(q),
    [],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(payments, searchFn);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink">{t.admin.paymentsTitle}</h1>
            <p className="mt-1 text-sm text-body">{t.admin.paymentsDesc}</p>
          </div>
        </div>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchPayments} />
      </div>

      <div className="overflow-x-auto overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gradient-to-r from-emerald-50 to-transparent text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.admin.when}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.customer}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.gateway}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.status}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.amount}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.providerRef}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-emerald-50/30">
                <td className="px-4 py-3 text-body">{p.createdAt}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{p.customerName}</p>
                  <p className="text-xs text-muted">{p.customerEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/10">
                    {p.gateway}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${paymentStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{p.amount}</td>
                <td className="px-4 py-3 font-mono text-xs text-body">{p.providerRef}</td>
                <td className="px-4 py-3">
                  {p.status === "SUCCEEDED" && <RefundButton paymentId={p.id} />}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted">
                  {t.admin.noPaymentsFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
