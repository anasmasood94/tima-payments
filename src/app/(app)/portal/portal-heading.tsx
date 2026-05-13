"use client";

import { useTranslation } from "@/lib/i18n/language-context";

export function PortalHeading() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-semibold text-ink">{t.portal.title}</h1>;
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
