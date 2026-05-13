"use client";

import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { useTranslation } from "@/lib/i18n/language-context";
import { AirwallexHppBridge } from "./airwallex-hpp-bridge";
import { MockPayForm } from "./mock-pay-form";

type Props = {
  paymentId: string;
  orderId: string;
  amountCents: number;
  invoiceId: string;
  gateway: string;
  useAirwallexHpp: boolean;
};

export function PayContent({ paymentId, orderId, amountCents, invoiceId, gateway, useAirwallexHpp }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href={`/portal/orders/${orderId}`} className="text-sm text-body underline">
        {t.paymentFlow.backToOrder}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.paymentFlow.hostedCheckout}</h1>
        {useAirwallexHpp ? (
          <p className="mt-2 text-sm text-body">{t.paymentFlow.airwallexDesc}</p>
        ) : (
          <p className="mt-2 text-sm text-body">{t.paymentFlow.mockDesc}</p>
        )}
      </div>
      <div className="rounded-lg border border-line bg-white p-4 text-sm">
        <p className="text-ink">
          {t.paymentFlow.pay} <span className="font-semibold">{formatUsd(amountCents)}</span>{" "}
          <span className="font-mono text-xs text-muted">({invoiceId})</span>
        </p>
        <p className="mt-2 text-xs text-muted">{t.paymentFlow.gateway} {gateway}</p>
      </div>
      {useAirwallexHpp ? <AirwallexHppBridge paymentId={paymentId} /> : <MockPayForm paymentId={paymentId} />}
    </div>
  );
}
