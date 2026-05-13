"use client";

import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { useTranslation } from "@/lib/i18n/language-context";

type Props = {
  product: {
    name: string;
    kind: string;
    sku: string;
    priceCents: number;
    description: string;
  };
};

export function ProductDetailContent({ product }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/catalog" className="inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-brand-dark">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t.catalog.backToCatalog}
      </Link>
      <span className="inline-flex items-center rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand-dark">{product.kind}</span>
      <h1 className="text-3xl font-semibold text-ink">{product.name}</h1>
      <p className="text-sm text-muted">{t.catalog.sku} {product.sku}</p>
      <p className="text-2xl font-semibold text-brand-dark">{formatUsd(product.priceCents)}</p>
      <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-body">{product.description}</p>
      </div>
      <p className="rounded-lg border border-brand/15 bg-brand/5 px-4 py-3 text-sm text-brand-dark">
        {t.catalog.purchaseInstructions}
      </p>
    </div>
  );
}
