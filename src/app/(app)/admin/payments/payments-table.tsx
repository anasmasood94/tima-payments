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
          className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
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
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t.admin.paymentsTitle}</h1>
          <p className="mt-1 text-sm text-body">{t.admin.paymentsDesc}</p>
        </div>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchPayments} />
      </div>

      <div className="overflow-x-auto overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">{t.admin.when}</th>
              <th className="px-4 py-2">{t.admin.customer}</th>
              <th className="px-4 py-2">{t.admin.gateway}</th>
              <th className="px-4 py-2">{t.admin.status}</th>
              <th className="px-4 py-2">{t.admin.amount}</th>
              <th className="px-4 py-2">{t.admin.providerRef}</th>
              <th className="px-4 py-2">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 text-body">{p.createdAt}</td>
                <td className="px-4 py-2">
                  <p className="font-medium text-ink">{p.customerName}</p>
                  <p className="text-xs text-muted">{p.customerEmail}</p>
                </td>
                <td className="px-4 py-2">{p.gateway}</td>
                <td className="px-4 py-2 font-medium text-ink">{p.status}</td>
                <td className="px-4 py-2">{p.amount}</td>
                <td className="px-4 py-2 font-mono text-xs text-body">{p.providerRef}</td>
                <td className="px-4 py-2">
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
