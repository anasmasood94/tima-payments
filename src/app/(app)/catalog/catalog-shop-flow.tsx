"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createOrderFromCatalogForm } from "@/actions/orders";
import { formatUsd } from "@/lib/format";
import type { ProductKind } from "@prisma/client";
import { CatalogPagination } from "./catalog-pagination";

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
            Sign in
          </Link>{" "}
          as a customer to choose quantities and place an order from this catalog.
        </p>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="space-y-8">
        <p className="text-sm text-body">
          Admin accounts can browse the catalog. Use a customer account to build a cart and submit orders.
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

        {/* Hidden fields: every active product so lines on other pages still submit. */}
        {allProductIds.map((id) => (
          <input key={`h-${id}`} type="hidden" name={`qty_${id}`} value={String(qty[id] ?? 0)} readOnly />
        ))}

        <div className="min-w-0 space-y-6 lg:col-start-1">
          <h2 className="text-lg font-semibold text-ink">Browse &amp; set quantities</h2>

          {products.length === 0 ? (
            <p className="text-sm text-body">No active products in the catalog yet.</p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {products.map((p) => {
                const q = qty[p.id] ?? 0;
                const lineCents = q > 0 ? q * p.priceCents : 0;
                return (
                  <li
                    key={p.id}
                    className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-colors ${
                      q > 0 ? "border-brand ring-1 ring-brand/15" : "border-line"
                    }`}
                  >
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">{p.kind}</p>
                        {q > 0 ? (
                          <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-white">
                            In cart
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                      <p className="line-clamp-3 text-sm text-body">{p.description}</p>
                      <p className="text-sm font-medium text-ink">{formatUsd(p.priceCents)} each</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
                      <div className="flex items-center gap-1">
                        <span className="sr-only">Quantity for {p.name}</span>
                        <button
                          type="button"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white text-lg font-medium text-ink hover:bg-panel"
                          aria-label={`Decrease ${p.name}`}
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
                          className="h-10 w-16 rounded-md border border-line bg-white px-2 text-center text-sm font-medium text-ink tabular-nums"
                          aria-label={`Quantity for ${p.name}`}
                        />
                        <button
                          type="button"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white text-lg font-medium text-ink hover:bg-panel"
                          aria-label={`Increase ${p.name}`}
                          onClick={() => setQuantity(p.id, stepQty(q, 1))}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted">Line total</p>
                        <p className="font-semibold text-ink">{q > 0 ? formatUsd(lineCents) : "—"}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="text-xs font-medium text-body underline"
                        onClick={() => setQuantity(p.id, stepQty(q, 1))}
                      >
                        Add 1
                      </button>
                      <span className="text-line">·</span>
                      <Link href={`/catalog/${p.slug}`} className="text-xs font-medium text-body underline">
                        Full description
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <CatalogPagination page={page} totalPages={totalPages} totalItems={totalItems} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1">
          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-ink">Your cart</h3>
            <p className="mt-1 text-xs text-muted">Review before submitting. You can adjust any line anytime.</p>

            {lineCount === 0 ? (
              <p className="mt-4 rounded-lg bg-panel px-3 py-6 text-center text-sm text-body">
                No items yet. Set quantity to at least <strong>1</strong> on one or more products.
              </p>
            ) : (
              <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto border-y border-line/60 py-3">
                {lines.map(({ product, quantity, lineCents }) => (
                  <li key={product.id} className="flex gap-2 text-sm">
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
                        className="text-xs font-medium text-red-700 underline"
                        onClick={() => setQuantity(product.id, 0)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-line/60 pt-4">
              <div>
                <p className="text-xs font-medium uppercase text-muted">Estimated subtotal</p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums text-ink">{formatUsd(subtotalCents)}</p>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-body underline disabled:opacity-40"
                disabled={lineCount === 0}
                onClick={clearCart}
              >
                Clear cart
              </button>
            </div>

            <label className="mt-5 block text-sm">
              <span className="text-body">Notes (optional)</span>
              <textarea
                name="notes"
                rows={3}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
                placeholder="Delivery window, dock hours, SKU notes…"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                name="intent"
                value="order"
                aria-disabled={!canSubmit}
                className={`rounded-md px-4 py-2.5 text-sm font-medium text-white sm:flex-1 ${
                  canSubmit ? "bg-brand hover:bg-brand-dark" : "cursor-not-allowed bg-line text-muted"
                }`}
              >
                {isPending ? "Submitting…" : "Place order"}
              </button>
              <button
                type="submit"
                name="intent"
                value="quote"
                aria-disabled={!canSubmit}
                className={`rounded-md border px-4 py-2.5 text-sm font-medium sm:flex-1 ${
                  canSubmit
                    ? "border-line bg-white text-ink hover:bg-panel"
                    : "cursor-not-allowed border-line bg-panel text-muted/70"
                }`}
              >
                {isPending ? "Submitting…" : "Request quote"}
              </button>
            </div>
            {!canSubmit && lineCount === 0 ? (
              <p className="mt-3 text-center text-xs text-muted">Add at least one product to enable checkout.</p>
            ) : null}
          </div>
        </aside>

        {/* Mobile: totals + primary actions without scrolling back to the cart card */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted">{lineCount} line(s)</p>
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
                  canSubmit ? "bg-brand hover:bg-brand-dark" : "cursor-not-allowed bg-line text-muted"
                }`}
              >
                {isPending ? "…" : "Place order"}
              </button>
              <button
                type="submit"
                name="intent"
                value="quote"
                aria-disabled={!canSubmit}
                className={`flex-1 rounded-md border py-2.5 text-sm font-medium ${
                  canSubmit
                    ? "border-line bg-white text-ink"
                    : "cursor-not-allowed border-line bg-panel text-muted/70"
                }`}
              >
                {isPending ? "…" : "Quote"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
