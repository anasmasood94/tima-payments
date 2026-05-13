"use client";

import { useActionState } from "react";
import type { Product, ProductKind } from "@prisma/client";
import { upsertProductAction } from "@/actions/admin-products";
import { useTranslation } from "@/lib/i18n/language-context";

type Props = {
  submitLabel: string;
  initial?: Pick<Product, "id" | "name" | "slug" | "sku" | "description" | "kind" | "active"> & { priceUsd: number };
};

export function ProductForm({ submitLabel, initial }: Props) {
  const [state, action] = useActionState(upsertProductAction, null as { error?: string } | null);
  const { t } = useTranslation();
  const priceUsd = initial ? initial.priceUsd : "";

  const field =
    "mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm";

  return (
    <form action={action} className="w-full space-y-4">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {state?.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      <label className="block text-sm">
        <span className="text-body">{t.productForm.name}</span>
        <input name="name" required defaultValue={initial?.name} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-body">{t.productForm.slug}</span>
        <input
          name="slug"
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          defaultValue={initial?.slug}
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="text-body">{t.productForm.sku}</span>
        <input name="sku" required defaultValue={initial?.sku} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-body">{t.productForm.description}</span>
        <textarea name="description" required rows={4} defaultValue={initial?.description} className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-body">{t.productForm.priceUsd}</span>
        <input
          name="priceUsd"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={priceUsd === "" ? undefined : priceUsd}
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="text-body">{t.productForm.kind}</span>
        <select name="kind" defaultValue={(initial?.kind as ProductKind) ?? "PRODUCT"} className={field}>
          <option value="PRODUCT">{t.productForm.product}</option>
          <option value="SERVICE">{t.productForm.service}</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} />
        <span className="text-body">{t.productForm.activeCatalog}</span>
      </label>
      <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
        {submitLabel}
      </button>
    </form>
  );
}
