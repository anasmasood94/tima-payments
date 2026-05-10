"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createOrderFromCatalogForm } from "@/actions/orders";
import { formatUsd } from "@/lib/format";
import type { ProductKind } from "@prisma/client";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  kind: ProductKind;
};

type Props = {
  products: CatalogProduct[];
  signedIn: boolean;
  isCustomer: boolean;
};

function stepQty(prev: number, delta: number) {
  return Math.max(0, Math.floor(prev + delta));
}

export function CatalogShopFlow({ products, signedIn, isCustomer }: Props) {
  const [state, action, isPending] = useActionState(createOrderFromCatalogForm, null as { error?: string } | null);
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((p) => [p.id, 0])) as Record<string, number>,
  );

  const lines = useMemo(() => {
    const out: { product: CatalogProduct; quantity: number; lineCents: number }[] = [];
    for (const p of products) {
      const q = qty[p.id] ?? 0;
      if (q > 0) {
        out.push({ product: p, quantity: q, lineCents: q * p.priceCents });
      }
    }
    return out;
  }, [products, qty]);

  const lineCount = lines.length;
  const subtotalCents = lines.reduce((s, l) => s + l.lineCents, 0);
  const canSubmit = lineCount > 0 && !isPending;

  const setQuantity = (productId: string, next: number) => {
    setQty((prev) => ({ ...prev, [productId]: Math.max(0, Math.floor(next)) }));
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
        <p className="text-sm text-zinc-600">
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

        {/* Hidden fields carry authoritative qty for the server (avoids controlled+name submit edge cases). */}
        {products.map((p) => (
          <input key={`h-${p.id}`} type="hidden" name={`qty_${p.id}`} value={String(qty[p.id] ?? 0)} readOnly />
        ))}

        <div className="min-w-0 space-y-6 lg:col-start-1">
          <h2 className="text-lg font-semibold text-zinc-900">Browse &amp; set quantities</h2>

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {products.map((p) => {
              const q = qty[p.id] ?? 0;
              const lineCents = q > 0 ? q * p.priceCents : 0;
              return (
                <li
                  key={p.id}
                  className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-colors ${
                    q > 0 ? "border-zinc-900 ring-1 ring-zinc-900/10" : "border-zinc-200"
                  }`}
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{p.kind}</p>
                      {q > 0 ? (
                        <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
                          In cart
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900">{p.name}</h3>
                    <p className="line-clamp-3 text-sm text-zinc-600">{p.description}</p>
                    <p className="text-sm font-medium text-zinc-900">{formatUsd(p.priceCents)} each</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                    <div className="flex items-center gap-1">
                      <span className="sr-only">Quantity for {p.name}</span>
                      <button
                        type="button"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-lg font-medium text-zinc-800 hover:bg-zinc-50"
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
                        className="h-10 w-16 rounded-md border border-zinc-300 bg-white px-2 text-center text-sm font-medium text-zinc-900 tabular-nums"
                        aria-label={`Quantity for ${p.name}`}
                      />
                      <button
                        type="button"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-lg font-medium text-zinc-800 hover:bg-zinc-50"
                        aria-label={`Increase ${p.name}`}
                        onClick={() => setQuantity(p.id, stepQty(q, 1))}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-zinc-500">Line total</p>
                      <p className="font-semibold text-zinc-900">{q > 0 ? formatUsd(lineCents) : "—"}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-xs font-medium text-zinc-700 underline"
                      onClick={() => setQuantity(p.id, stepQty(q, 1))}
                    >
                      Add 1
                    </button>
                    <span className="text-zinc-300">·</span>
                    <Link href={`/catalog/${p.slug}`} className="text-xs font-medium text-zinc-700 underline">
                      Full description
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-zinc-900">Your cart</h3>
            <p className="mt-1 text-xs text-zinc-500">Review before submitting. You can adjust any line anytime.</p>

            {lineCount === 0 ? (
              <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-600">
                No items yet. Set quantity to at least <strong>1</strong> on one or more products.
              </p>
            ) : (
              <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto border-y border-zinc-100 py-3">
                {lines.map(({ product, quantity, lineCents }) => (
                  <li key={product.id} className="flex gap-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-900">{product.name}</p>
                      <p className="text-xs text-zinc-500">
                        {formatUsd(product.priceCents)} × {quantity}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium text-zinc-900">{formatUsd(lineCents)}</p>
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

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-zinc-100 pt-4">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Estimated subtotal</p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums text-zinc-900">{formatUsd(subtotalCents)}</p>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-zinc-600 underline disabled:opacity-40"
                disabled={lineCount === 0}
                onClick={() => setQty(Object.fromEntries(products.map((p) => [p.id, 0])) as Record<string, number>)}
              >
                Clear cart
              </button>
            </div>

            <label className="mt-5 block text-sm">
              <span className="text-zinc-700">Notes (optional)</span>
              <textarea
                name="notes"
                rows={3}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
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
                  canSubmit ? "bg-zinc-900 hover:bg-zinc-800" : "cursor-not-allowed bg-zinc-400"
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
                    ? "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
                }`}
              >
                {isPending ? "Submitting…" : "Request quote"}
              </button>
            </div>
            {!canSubmit && lineCount === 0 ? (
              <p className="mt-3 text-center text-xs text-zinc-500">Add at least one product to enable checkout.</p>
            ) : null}
          </div>
        </aside>

        {/* Mobile: totals + primary actions without scrolling back to the cart card */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500">{lineCount} line(s)</p>
                <p className="text-lg font-semibold tabular-nums text-zinc-900">{formatUsd(subtotalCents)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                name="intent"
                value="order"
                aria-disabled={!canSubmit}
                className={`flex-1 rounded-md py-2.5 text-sm font-medium text-white ${
                  canSubmit ? "bg-zinc-900 hover:bg-zinc-800" : "cursor-not-allowed bg-zinc-400"
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
                    ? "border-zinc-300 bg-white text-zinc-800"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
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
