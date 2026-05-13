"use client";

import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { orderStatusLabel } from "@/lib/order-status";
import { useTranslation } from "@/lib/i18n/language-context";
import { IssueInvoiceModalTrigger } from "./issue-invoice-modal-trigger";
import type { OrderStatus } from "@prisma/client";

type OrderLine = {
  id: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
};

type InvoiceData = {
  id: string;
  number: string;
  amountCents: number;
  status: string;
};

type Props = {
  orderId: string;
  orderStatus: OrderStatus;
  userName: string;
  userEmail: string;
  notes: string | null;
  lines: OrderLine[];
  subtotalCents: number;
  invoices: InvoiceData[];
  canIssue: boolean;
  issued: boolean;
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

export function AdminOrderDetailContent({
  orderId,
  orderStatus,
  userName,
  userEmail,
  notes,
  lines,
  subtotalCents,
  invoices,
  canIssue,
  issued,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {issued ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {t.adminOrder.invoiceIssued}
        </p>
      ) : null}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-ink">{t.adminOrder.orderDetail}</h1>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink">{userName}</span>
          <span className="text-sm text-muted">{userEmail}</span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor(orderStatus)}`}>
            {orderStatusLabel(orderStatus, t.orderStatus)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line shadow-sm">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-transparent text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.adminOrder.item}</th>
              <th className="px-4 py-3 font-semibold">{t.adminOrder.qty}</th>
              <th className="px-4 py-3 font-semibold">{t.adminOrder.unit}</th>
              <th className="px-4 py-3 font-semibold">{t.adminOrder.line}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {lines.map((line) => (
              <tr key={line.id} className="transition-colors hover:bg-blue-50/30">
                <td className="px-4 py-3 font-medium text-ink">{line.productName}</td>
                <td className="px-4 py-3">{line.quantity}</td>
                <td className="px-4 py-3">{formatUsd(line.unitPriceCents)}</td>
                <td className="px-4 py-3 font-medium">{formatUsd(line.quantity * line.unitPriceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2 rounded-lg bg-blue-50/50 px-4 py-3">
        <span className="text-sm text-body">{t.adminOrder.subtotal}</span>
        <span className="text-lg font-semibold text-ink">{formatUsd(subtotalCents)}</span>
      </div>

      {notes ? (
        <div className="rounded-lg border border-line bg-white p-4 text-sm shadow-sm">
          <p className="text-xs font-medium uppercase text-muted">{t.adminOrder.customerNotes}</p>
          <p className="mt-1 whitespace-pre-wrap text-ink">{notes}</p>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-ink">{t.adminOrder.invoicesHeading}</h2>
          </div>
          {canIssue ? <IssueInvoiceModalTrigger orderId={orderId} computedSubtotalCents={subtotalCents} /> : null}
        </div>
        {invoices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-6 text-center">
            <p className="text-sm text-body">{t.adminOrder.noInvoices}</p>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm transition-colors hover:bg-amber-50/30">
                <div className="flex items-center gap-2">
                  <Link href="/admin/invoices" className="font-medium text-blue-600 transition-colors hover:text-blue-800">
                    {inv.number}
                  </Link>
                  <span className="font-medium text-ink">{formatUsd(inv.amountCents)}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${invoiceStatusColor(inv.status)}`}>
                    {inv.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
