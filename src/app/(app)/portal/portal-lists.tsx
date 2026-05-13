"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";

export type PortalOrderRow = {
  id: string;
  status: string;
  lineCount: number;
  createdAt: string;
};

export type PortalInvoiceRow = {
  id: string;
  number: string;
  amount: string;
  status: string;
};

export function PortalOrdersList({ orders }: { orders: PortalOrderRow[] }) {
  const { t } = useTranslation();

  const searchFn = useCallback(
    (o: PortalOrderRow, q: string) =>
      o.status.toLowerCase().includes(q) ||
      o.createdAt.toLowerCase().includes(q),
    [],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(orders, searchFn);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-ink">{t.portal.recentOrders}</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-body">{t.portal.noOrders}</p>
      ) : (
        <>
          <div className="max-w-sm">
            <SearchBar value={query} onChange={setQuery} placeholder="Search orders…" />
          </div>
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {paginated.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{o.status}</p>
                  <p className="text-xs text-muted">
                    {o.lineCount} line(s) · {o.createdAt}
                  </p>
                </div>
                <Link href={`/portal/orders/${o.id}`} className="text-sm font-medium text-ink underline">
                  {t.portal.view}
                </Link>
              </li>
            ))}
            {paginated.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted">No orders found.</li>
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
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-ink">{t.portal.invoices}</h2>
      {invoices.length === 0 ? (
        <p className="text-sm text-body">{t.portal.noInvoices}</p>
      ) : (
        <>
          <div className="max-w-sm">
            <SearchBar value={query} onChange={setQuery} placeholder="Search invoices…" />
          </div>
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {paginated.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{inv.number}</p>
                  <p className="text-xs text-muted">
                    {inv.amount} · {inv.status}
                  </p>
                </div>
                <Link href={`/portal/invoices/${inv.id}`} className="text-sm font-medium text-ink underline">
                  {t.portal.open}
                </Link>
              </li>
            ))}
            {paginated.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted">No invoices found.</li>
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
