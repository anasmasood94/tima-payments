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
        <h1 className="text-2xl font-semibold text-ink">{t.adminOrder.orderDetail}</h1>
        <p className="mt-1 text-sm text-body">
          {userName} · {userEmail} · {orderStatusLabel(orderStatus, t.orderStatus)}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">{t.adminOrder.item}</th>
              <th className="px-4 py-2">{t.adminOrder.qty}</th>
              <th className="px-4 py-2">{t.adminOrder.unit}</th>
              <th className="px-4 py-2">{t.adminOrder.line}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-2">{line.productName}</td>
                <td className="px-4 py-2">{line.quantity}</td>
                <td className="px-4 py-2">{formatUsd(line.unitPriceCents)}</td>
                <td className="px-4 py-2">{formatUsd(line.quantity * line.unitPriceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm font-medium">{t.adminOrder.subtotal} {formatUsd(subtotalCents)}</p>

      {notes ? (
        <div className="rounded-lg border border-line bg-white p-4 text-sm">
          <p className="text-xs font-medium uppercase text-muted">{t.adminOrder.customerNotes}</p>
          <p className="mt-1 whitespace-pre-wrap">{notes}</p>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">{t.adminOrder.invoicesHeading}</h2>
          {canIssue ? <IssueInvoiceModalTrigger orderId={orderId} computedSubtotalCents={subtotalCents} /> : null}
        </div>
        {invoices.length === 0 ? (
          <p className="text-sm text-body">{t.adminOrder.noInvoices}</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link href="/admin/invoices" className="underline">
                  {inv.number}
                </Link>{" "}
                — {formatUsd(inv.amountCents)} · {inv.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
