"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";
import { orderStatusLabel } from "@/lib/order-status";
import type { OrderStatus } from "@prisma/client";

export type OrderRow = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  userName: string;
  userEmail: string;
  lineCount: number;
};

function statusColor(status: OrderStatus) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "PLACED":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "CONFIRMED":
      return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";
    case "INVOICED":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "QUOTE_REQUESTED":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";
    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const { t } = useTranslation();

  const searchFn = useCallback(
    (o: OrderRow, q: string) =>
      o.userName.toLowerCase().includes(q) ||
      o.userEmail.toLowerCase().includes(q) ||
      orderStatusLabel(o.status, t.orderStatus).toLowerCase().includes(q),
    [t.orderStatus],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(orders, searchFn);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-ink">{t.admin.ordersTitle}</h1>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchOrders} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-transparent text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.admin.when}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.customer}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.status}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.linesCol}</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-blue-50/30">
                <td className="px-4 py-3 text-body">{o.createdAt}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{o.userName}</p>
                  <p className="text-xs text-muted">{o.userEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor(o.status)}`}>
                    {orderStatusLabel(o.status, t.orderStatus)}
                  </span>
                </td>
                <td className="px-4 py-3">{o.lineCount}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="inline-flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-800">
                    {t.admin.openAction}
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted">
                  {t.admin.noOrdersFound}
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
