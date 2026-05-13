"use client";

import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";

export type InvoiceRow = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  status: string;
  createdAt: string;
};

function invoiceStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "ISSUED":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "VOID":
      return "bg-red-50 text-red-700 ring-red-600/20";
    case "DRAFT":
      return "bg-gray-50 text-gray-600 ring-gray-500/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  const { t } = useTranslation();

  const searchFn = useCallback(
    (inv: InvoiceRow, q: string) =>
      inv.number.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.customerEmail.toLowerCase().includes(q) ||
      inv.status.toLowerCase().includes(q),
    [],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(invoices, searchFn);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
          <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-ink">{t.admin.invoicesTitle}</h1>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchInvoices} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-amber-50 to-transparent text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.admin.number}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.customer}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.amount}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.status}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.created}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((inv) => (
              <tr key={inv.id} className="transition-colors hover:bg-amber-50/30">
                <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{inv.customerName}</p>
                  <p className="text-xs text-muted">{inv.customerEmail}</p>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{inv.amount}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${invoiceStatusColor(inv.status)}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-body">{inv.createdAt}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted">
                  {t.admin.noInvoicesFound}
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
