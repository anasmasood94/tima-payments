"use client";

import { useActionState } from "react";
import { issueInvoiceFormAction } from "@/actions/invoices";
import { formatUsd } from "@/lib/format";

type Props = {
  orderId: string;
  computedSubtotalCents: number;
};

export function IssueInvoiceForm({ orderId, computedSubtotalCents }: Props) {
  const [state, action] = useActionState(issueInvoiceFormAction, null as { error?: string } | null);

  return (
    <form action={action} className="w-full max-w-md space-y-4">
      <input type="hidden" name="orderId" value={orderId} />
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <p className="text-sm text-body">
        Line-item subtotal: <span className="font-medium text-ink">{formatUsd(computedSubtotalCents)}</span>
      </p>
      <label className="block text-sm">
        <span className="text-body">
          Invoice total (USD) — leave blank to use subtotal; override for quoted / adjusted amounts
        </span>
        <input
          name="invoiceTotalUsd"
          type="number"
          step="0.01"
          min="0.01"
          placeholder={(computedSubtotalCents / 100).toFixed(2)}
          className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-brick px-4 py-2 text-sm font-medium text-white hover:bg-brick/90"
      >
        Issue invoice
      </button>
    </form>
  );
}
