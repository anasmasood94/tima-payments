"use client";

import { useTranslation } from "@/lib/i18n/language-context";

export function AdminHeading() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">{t.admin.dashboard}</h1>
      <p className="mt-2 text-sm text-body">{t.admin.dashboardDesc}</p>
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
