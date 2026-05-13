"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createOrderFromCatalogForm } from "@/actions/orders";
import { formatUsd } from "@/lib/format";
import type { ProductKind } from "@prisma/client";
import { AdminModal } from "@/components/admin-modal";
import { CatalogPagination } from "./catalog-pagination";
import { useTranslation } from "@/lib/i18n/language-context";

const QTY_STORAGE_KEY = "tima-catalog-qty-v1";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  kind: ProductKind;
};

export type CatalogProductSummary = Pick<CatalogProduct, "id" | "slug" | "name" | "priceCents" | "kind">;

type Props = {
  products: CatalogProduct[];
  allProductIds: string[];
  allProductsMeta: CatalogProductSummary[];
  signedIn: boolean;
  isCustomer: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
};

function stepQty(prev: number, delta: number) {
  return Math.max(0, Math.floor(prev + delta));
}

export function CatalogShopFlow({
  products,
  allProductIds,
  allProductsMeta,
  signedIn,
  isCustomer,
  page,
  totalPages,
  totalItems,
}: Props) {
  const [state, action, isPending] = useActionState(createOrderFromCatalogForm, null as { error?: string } | null);
  const [qty, setQty] = useState<Record<string, number>>(
    () => Object.fromEntries(allProductIds.map((id) => [id, 0])) as Record<string, number>,
  );
  const { t } = useTranslation();

  const idsKey = allProductIds.join("|");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(QTY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      setQty((prev) => {
        const next = { ...prev };
        for (const id of allProductIds) {
          const v = Number(parsed[id]);
          if (Number.isFinite(v) && v >= 0) next[id] = Math.floor(v);
        }
        return next;
      });
    } catch {
      /* ignore corrupt storage */
    }
  }, [idsKey, allProductIds]);

  useEffect(() => {
    try {
      sessionStorage.setItem(QTY_STORAGE_KEY, JSON.stringify(qty));
    } catch {
      /* ignore quota / private mode */
    }
  }, [qty]);

  const lines = useMemo(() => {
    const out: { product: CatalogProductSummary; quantity: number; lineCents: number }[] = [];
    for (const p of allProductsMeta) {
      const q = qty[p.id] ?? 0;
      if (q > 0) {
        out.push({ product: p, quantity: q, lineCents: q * p.priceCents });
      }
    }
    return out;
  }, [allProductsMeta, qty]);

  const lineCount = lines.length;
  const subtotalCents = lines.reduce((s, l) => s + l.lineCents, 0);
  const canSubmit = lineCount > 0 && !isPending;

  const setQuantity = (productId: string, next: number) => {
    setQty((prev) => ({ ...prev, [productId]: Math.max(0, Math.floor(next)) }));
  };

  const [descProduct, setDescProduct] = useState<CatalogProduct | null>(null);

  const clearCart = () => {
    setQty(Object.fromEntries(allProductIds.map((id) => [id, 0])) as Record<string, number>);
    try {
      sessionStorage.removeItem(QTY_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  if (!signedIn) {
    return (
      <div className="space-y-8">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Link href="/login" className="font-medium underline">
            {t.catalog.signIn}
          </Link>{" "}
          {t.catalog.signInPrompt}
        </p>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="space-y-8">
        <p className="text-sm text-body">
          {t.catalog.adminBrowse}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32 lg:pb-10" id="shop">
      <form
        action={action}
        className="space-y-8 lg:grid lg:grid-cols-[1fr_min(22rem,100%)] lg:items-start lg:gap-8"
        onSubmit={(e) => {
          if (lineCount === 0) {
            e.preventDefault();
          }
        }}
      >
        {state?.error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 lg:col-span-2">
            {state.error}
          </p>
        ) : null}

        {allProductIds.map((id) => (
          <input key={`h-${id}`} type="hidden" name={`qty_${id}`} value={String(qty[id] ?? 0)} readOnly />
        ))}

        <div className="min-w-0 space-y-6 lg:col-start-1">
          {products.length === 0 ? (
            <p className="text-sm text-body">{t.catalog.noProducts}</p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {products.map((p) => {
                const q = qty[p.id] ?? 0;
                const lineCents = q > 0 ? q * p.priceCents : 0;
                return (
                  <li
                    key={p.id}
                    className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-all ${
                      q > 0 ? "border-brand ring-1 ring-brand/15 shadow-brand/5" : "border-line hover:border-brand/30 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand-dark">{p.kind}</span>
                        {q > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-xs font-medium text-white">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {t.catalog.inCart}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                      <p className="line-clamp-3 text-sm text-body">{p.description}</p>
                      <p className="text-sm font-semibold text-brand-dark">{formatUsd(p.priceCents)} {t.catalog.each}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white text-lg font-medium text-ink transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
                          aria-label={`− ${p.name}`}
                          onClick={() => setQuantity(p.id, stepQty(q, -1))}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          inputMode="numeric"
                          value={q}
                          onChange={(e) => setQuantity(p.id, Number(e.target.value) || 0)}
                          className="h-10 w-16 rounded-md border border-line bg-white px-2 text-center text-sm font-medium text-ink tabular-nums focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                          aria-label={p.name}
                        />
                        <button
                          type="button"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white text-lg font-medium text-ink transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
                          aria-label={`+ ${p.name}`}
                          onClick={() => setQuantity(p.id, stepQty(q, 1))}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted">{t.catalog.lineTotal}</p>
                        <p className="font-semibold text-ink">{q > 0 ? formatUsd(lineCents) : "—"}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="text-xs font-medium text-brand underline transition-colors hover:text-brand-dark"
                        onClick={() => setQuantity(p.id, stepQty(q, 1))}
                      >
                        {t.catalog.addOne}
                      </button>
                      <span className="text-line">·</span>
                      <button
                        type="button"
                        className="text-xs font-medium text-body underline"
                        onClick={() => setDescProduct(p)}
                      >
                        {t.catalog.fullDescription}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <CatalogPagination page={page} totalPages={totalPages} totalItems={totalItems} />
        </div>

        <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1">
          <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
            <div className="bg-gradient-to-r from-brand to-brand-dark px-5 py-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-white/80" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <h3 className="text-base font-semibold text-white">{t.catalog.yourCart}</h3>
              </div>
              <p className="mt-1 text-xs text-white/70">{t.catalog.cartReview}</p>
            </div>

            <div className="p-5">
              {lineCount === 0 ? (
                <div className="rounded-lg border border-dashed border-line bg-panel/50 px-3 py-6 text-center">
                  <svg className="mx-auto h-8 w-8 text-muted/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-body">
                    {t.catalog.emptyCart} <strong>1</strong> {t.catalog.emptyCartSuffix}
                  </p>
                </div>
              ) : (
                <ul className="max-h-64 space-y-2 overflow-y-auto border-b border-line/60 pb-3">
                  {lines.map(({ product, quantity, lineCents }) => (
                    <li key={product.id} className="flex gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-brand/[0.03]">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink">{product.name}</p>
                        <p className="text-xs text-muted">
                          {formatUsd(product.priceCents)} × {quantity}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-medium text-ink">{formatUsd(lineCents)}</p>
                        <button
                          type="button"
                          className="text-xs font-medium text-red-600 underline transition-colors hover:text-red-800"
                          onClick={() => setQuantity(product.id, 0)}
                        >
                          {t.catalog.remove}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex items-end justify-between gap-4 border-t border-line/60 pt-4">
                <div>
                  <p className="text-xs font-medium uppercase text-muted">{t.catalog.estimatedSubtotal}</p>
                  <p className="mt-0.5 text-2xl font-semibold tabular-nums text-ink">{formatUsd(subtotalCents)}</p>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-body underline disabled:opacity-40"
                  disabled={lineCount === 0}
                  onClick={clearCart}
                >
                  {t.catalog.clearCart}
                </button>
              </div>

              <label className="mt-5 block text-sm">
                <span className="text-body">{t.catalog.notesLabel}</span>
                <textarea
                  name="notes"
                  rows={3}
                  className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                  placeholder={t.catalog.notesPlaceholder}
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  name="intent"
                  value="order"
                  aria-disabled={!canSubmit}
                  className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors sm:flex-1 ${
                    canSubmit ? "bg-brand shadow-sm shadow-brand/25 hover:bg-brand-dark" : "cursor-not-allowed bg-line text-muted"
                  }`}
                >
                  {isPending ? t.catalog.submitting : t.catalog.placeOrder}
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="quote"
                  aria-disabled={!canSubmit}
                  className={`rounded-md border px-4 py-2.5 text-sm font-medium transition-colors sm:flex-1 ${
                    canSubmit
                      ? "border-brand/20 bg-white text-brand hover:bg-brand/5"
                      : "cursor-not-allowed border-line bg-panel text-muted/70"
                  }`}
                >
                  {isPending ? t.catalog.submitting : t.catalog.requestQuote}
                </button>
              </div>
              {!canSubmit && lineCount === 0 ? (
                <p className="mt-3 text-center text-xs text-muted">{t.catalog.addProductPrompt}</p>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted">{lineCount} {t.catalog.lines}</p>
                <p className="text-lg font-semibold tabular-nums text-ink">{formatUsd(subtotalCents)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                name="intent"
                value="order"
                aria-disabled={!canSubmit}
                className={`flex-1 rounded-md py-2.5 text-sm font-medium text-white ${
                  canSubmit ? "bg-brand shadow-sm shadow-brand/25 hover:bg-brand-dark" : "cursor-not-allowed bg-line text-muted"
                }`}
              >
                {isPending ? "…" : t.catalog.placeOrder}
              </button>
              <button
                type="submit"
                name="intent"
                value="quote"
                aria-disabled={!canSubmit}
                className={`flex-1 rounded-md border py-2.5 text-sm font-medium ${
                  canSubmit
                    ? "border-brand/20 bg-white text-brand"
                    : "cursor-not-allowed border-line bg-panel text-muted/70"
                }`}
              >
                {isPending ? "…" : t.catalog.quote}
              </button>
            </div>
          </div>
        </div>
      </form>

      <AdminModal
        open={descProduct !== null}
        onClose={() => setDescProduct(null)}
        title={descProduct?.name ?? ""}
      >
        {descProduct ? (
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand-dark">{descProduct.kind}</span>
            <p className="text-sm font-semibold text-brand-dark">{formatUsd(descProduct.priceCents)} {t.catalog.each}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-body">
              {descProduct.description}
            </p>
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
}
