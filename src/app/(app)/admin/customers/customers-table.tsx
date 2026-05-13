"use client";

import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  companyName: string;
  createdAt: string;
};

export function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  const { t } = useTranslation();

  const searchFn = useCallback(
    (c: CustomerRow, q: string) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q),
    [],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(customers, searchFn);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t.admin.customersTitle}</h1>
          <p className="mt-1 text-sm text-body">{t.admin.customersDesc}</p>
        </div>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchCustomers} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">{t.admin.name}</th>
              <th className="px-4 py-2">{t.admin.email}</th>
              <th className="px-4 py-2">{t.admin.company}</th>
              <th className="px-4 py-2">{t.admin.registered}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-2 text-body">{c.email}</td>
                <td className="px-4 py-2 text-body">{c.companyName}</td>
                <td className="px-4 py-2 text-body">{c.createdAt}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted">
                  {t.admin.noCustomersFound}
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
