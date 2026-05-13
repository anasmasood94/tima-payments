"use client";

import { useActionState } from "react";
import { startHostedCheckoutFormAction } from "@/actions/payments";
import { useTranslation } from "@/lib/i18n/language-context";

export function InvoicePayForm({ invoiceId, csrfToken }: { invoiceId: string; csrfToken: string }) {
  const [state, action] = useActionState(startHostedCheckoutFormAction, null as { error?: string } | null);
  const { t } = useTranslation();

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <input type="hidden" name="_csrf" value={csrfToken} />
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        {t.paymentFlow.payHostedCheckout}
      </button>
      <p className="text-xs text-muted">
        {t.paymentFlow.payHostedDesc}
      </p>
    </form>
  );
}
