"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";

export type OrderRow = {
  id: string;
  createdAt: string;
  status: string;
  userName: string;
  userEmail: string;
  lineCount: number;
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const searchFn = useCallback(
    (o: OrderRow, q: string) =>
      o.userName.toLowerCase().includes(q) ||
      o.userEmail.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q),
    [],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(orders, searchFn);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by customer or status…" />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Lines</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2 text-body">{o.createdAt}</td>
                <td className="px-4 py-2">
                  <p className="font-medium text-ink">{o.userName}</p>
                  <p className="text-xs text-muted">{o.userEmail}</p>
                </td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2">{o.lineCount}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted">
                  No orders found.
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
