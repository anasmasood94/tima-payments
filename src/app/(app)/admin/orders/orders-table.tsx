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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">{t.admin.ordersTitle}</h1>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchOrders} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">{t.admin.when}</th>
              <th className="px-4 py-2">{t.admin.customer}</th>
              <th className="px-4 py-2">{t.admin.status}</th>
              <th className="px-4 py-2">{t.admin.linesCol}</th>
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
                <td className="px-4 py-2">{orderStatusLabel(o.status, t.orderStatus)}</td>
                <td className="px-4 py-2">{o.lineCount}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink underline">
                    {t.admin.openAction}
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
