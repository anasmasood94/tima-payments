"use client";

import { useTranslation } from "@/lib/i18n/language-context";

type Props = {
  created: boolean;
  paid: boolean;
};

export function PortalStatusMessages({ created, paid }: Props) {
  const { t } = useTranslation();

  return (
    <>
      {created ? (
        <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-medium text-emerald-900">{t.portal.requestSubmitted}</p>
          <p className="mt-2 text-emerald-900">{t.portal.invoiceInstructions}</p>
        </div>
      ) : null}
      {paid ? <p className="mt-2 text-sm text-emerald-700">{t.portal.paymentRecorded}</p> : null}
    </>
  );
}
