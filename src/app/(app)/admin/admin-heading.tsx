"use client";

import { useTranslation } from "@/lib/i18n/language-context";

export function AdminHeading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
        <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.admin.dashboard}</h1>
        <p className="mt-1 text-sm text-body">{t.admin.dashboardDesc}</p>
      </div>
    </div>
  );
}

const labelMap = {
  Orders: "orders",
  Products: "products",
  Invoices: "invoices",
  Customers: "customers",
  Payments: "payments",
} as const;

export function AdminStatLabel({ label }: { label: string }) {
  const { t } = useTranslation();
  const key = labelMap[label as keyof typeof labelMap];
  return <>{key ? t.admin[key] : label}</>;
}
