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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink">{t.admin.customersTitle}</h1>
            <p className="mt-1 text-sm text-body">{t.admin.customersDesc}</p>
          </div>
        </div>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchCustomers} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-indigo-50 to-transparent text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.admin.name}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.email}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.company}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.registered}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-indigo-50/30">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-body">{c.email}</td>
                <td className="px-4 py-3 text-body">{c.companyName}</td>
                <td className="px-4 py-3 text-body">{c.createdAt}</td>
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
