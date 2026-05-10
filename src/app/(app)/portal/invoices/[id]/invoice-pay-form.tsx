"use client";

import { useActionState } from "react";
import { startHostedCheckoutFormAction } from "@/actions/payments";

export function InvoicePayForm({ invoiceId }: { invoiceId: string }) {
  const [state, action] = useActionState(startHostedCheckoutFormAction, null as { error?: string } | null);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="invoiceId" value={invoiceId} />
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        className="rounded-md bg-brick px-4 py-2 text-sm font-medium text-white hover:bg-brick/90"
      >
        Pay with hosted checkout
      </button>
      <p className="text-xs text-muted">
        You will leave this site to complete payment with your provider. Card entry, 3-D Secure / SCA, and other
        authentication steps happen on hosted pages from your payment provider; we never store card numbers or CVV
        here.
      </p>
    </form>
  );
}
