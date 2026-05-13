"use client";

import { useActionState } from "react";
import { completeMockPaymentFormAction } from "@/actions/payments";
import { useTranslation } from "@/lib/i18n/language-context";

export function MockPayForm({ paymentId }: { paymentId: string }) {
  const [state, action] = useActionState(completeMockPaymentFormAction, null as { error?: string } | null);
  const { t } = useTranslation();

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="paymentId" value={paymentId} />
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        className="w-full rounded-md bg-emerald-700 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
      >
        {t.paymentFlow.simulatePayment}
      </button>
    </form>
  );
}
