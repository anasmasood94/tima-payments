"use client";

import { useCallback } from "react";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";

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

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
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
    <div className="space-y-4">
      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by customer, gateway, or status…" />
      </div>

      <div className="overflow-x-auto overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Gateway</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Provider ref</th>
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
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted">
                  No payments found.
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
