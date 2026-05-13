"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

export function CatalogHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.catalog.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-body">{t.catalog.description}</p>
      </div>
      <Link href="/portal" className="text-sm font-medium text-body underline">
        {t.catalog.myAccount}
      </Link>
    </div>
  );
}
