"use client";

import { useTranslation } from "@/lib/i18n/language-context";

export function PortalHeading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
        <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-ink">{t.portal.title}</h1>
    </div>
  );
}

export function PortalSectionTitle({ section }: { section: "recentOrders" | "invoices" }) {
  const { t } = useTranslation();
  return <h2 className="text-lg font-semibold text-ink">{t.portal[section]}</h2>;
}

export function PortalEmptyText({ type }: { type: "orders" | "invoices" }) {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-body">
      {type === "orders" ? t.portal.noOrders : t.portal.noInvoices}
    </p>
  );
}

export function PortalViewLink() {
  const { t } = useTranslation();
  return <>{t.portal.view}</>;
}

export function PortalOpenLink() {
  const { t } = useTranslation();
  return <>{t.portal.open}</>;
}
