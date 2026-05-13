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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">{t.admin.invoicesTitle}</h1>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchInvoices} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">{t.admin.number}</th>
              <th className="px-4 py-2">{t.admin.customer}</th>
              <th className="px-4 py-2">{t.admin.amount}</th>
              <th className="px-4 py-2">{t.admin.status}</th>
              <th className="px-4 py-2">{t.admin.created}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-2 font-mono text-xs">{inv.number}</td>
                <td className="px-4 py-2">
                  <p className="font-medium text-ink">{inv.customerName}</p>
                  <p className="text-xs text-muted">{inv.customerEmail}</p>
                </td>
                <td className="px-4 py-2">{inv.amount}</td>
                <td className="px-4 py-2">{inv.status}</td>
                <td className="px-4 py-2 text-body">{inv.createdAt}</td>
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
