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
      <Link href="/catalog" className="text-sm text-body underline">
        {t.catalog.backToCatalog}
      </Link>
      <p className="text-xs font-medium uppercase text-muted">{product.kind}</p>
      <h1 className="text-3xl font-semibold text-ink">{product.name}</h1>
      <p className="text-sm text-body">{t.catalog.sku} {product.sku}</p>
      <p className="text-lg font-medium text-ink">{formatUsd(product.priceCents)}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-body">{product.description}</p>
      <p className="text-sm text-body">
        {t.catalog.purchaseInstructions}
      </p>
    </div>
  );
}
