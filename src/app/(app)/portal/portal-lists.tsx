"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";
import { orderStatusLabel } from "@/lib/order-status";
import type { OrderStatus } from "@prisma/client";

export type PortalOrderRow = {
  id: string;
  status: OrderStatus;
  lineCount: number;
  createdAt: string;
};

export type PortalInvoiceRow = {
  id: string;
  number: string;
  amount: string;
  status: string;
};

function orderStatusColor(status: OrderStatus) {
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

function invoiceStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "ISSUED":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "VOID":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

export function PortalOrdersList({ orders }: { orders: PortalOrderRow[] }) {
  const { t } = useTranslation();

  const searchFn = useCallback(
    (o: PortalOrderRow, q: string) =>
      orderStatusLabel(o.status, t.orderStatus).toLowerCase().includes(q) ||
      o.createdAt.toLowerCase().includes(q),
    [t.orderStatus],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(orders, searchFn);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
          <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-ink">{t.portal.recentOrders}</h2>
      </div>
      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <svg className="mx-auto h-10 w-10 text-muted/40" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="mt-3 text-sm text-body">{t.portal.noOrders}</p>
        </div>
      ) : (
        <>
          <div className="max-w-sm">
            <SearchBar value={query} onChange={setQuery} placeholder={t.portal.searchOrders} />
          </div>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm">
            {paginated.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm transition-colors hover:bg-brand/[0.02]">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${orderStatusColor(o.status)}`}>
                    {orderStatusLabel(o.status, t.orderStatus)}
                  </span>
                  <p className="text-xs text-muted">
                    {o.lineCount} {t.portal.lines} · {o.createdAt}
                  </p>
                </div>
                <Link href={`/portal/orders/${o.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-dark">
                  {t.portal.view}
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </li>
            ))}
            {paginated.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted">{t.portal.noOrdersFound}</li>
            )}
          </ul>
          {showPagination && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </section>
  );
}

export function PortalInvoicesList({ invoices }: { invoices: PortalInvoiceRow[] }) {
  const { t } = useTranslation();

  const searchFn = useCallback(
    (inv: PortalInvoiceRow, q: string) =>
      inv.number.toLowerCase().includes(q) ||
      inv.status.toLowerCase().includes(q) ||
      inv.amount.toLowerCase().includes(q),
    [],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(invoices, searchFn);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
          <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-ink">{t.portal.invoices}</h2>
      </div>
      {invoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <svg className="mx-auto h-10 w-10 text-muted/40" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="mt-3 text-sm text-body">{t.portal.noInvoices}</p>
        </div>
      ) : (
        <>
          <div className="max-w-sm">
            <SearchBar value={query} onChange={setQuery} placeholder={t.portal.searchInvoices} />
          </div>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm">
            {paginated.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm transition-colors hover:bg-brand/[0.02]">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-ink">{inv.number}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{inv.amount}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${invoiceStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/portal/invoices/${inv.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-dark">
                  {t.portal.open}
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </li>
            ))}
            {paginated.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted">{t.portal.noInvoicesFound}</li>
            )}
          </ul>
          {showPagination && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </section>
  );
}
