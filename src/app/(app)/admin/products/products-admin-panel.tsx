"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductKind } from "@prisma/client";
import { AdminModal } from "@/components/admin-modal";
import { formatUsd } from "@/lib/format";
import { useTranslation } from "@/lib/i18n/language-context";
import { deactivateProductFormAction } from "@/actions/admin-products";
import { useSearchPagination, SearchBar, Pagination } from "@/components/admin-list-controls";
import { ProductForm } from "./product-form";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  kind: ProductKind;
  active: boolean;
  priceCents: number;
};

function ProductsAdminPanelInner({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openedFromQuery = useRef(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (openedFromQuery.current) return;
    const q = searchParams.get("edit");
    if (!q) return;
    openedFromQuery.current = true;
    if (products.some((p) => p.id === q)) {
      setEditId(q);
    }
    router.replace("/admin/products", { scroll: false });
  }, [searchParams, router, products]);

  const editing = useMemo(() => products.find((p) => p.id === editId) ?? null, [products, editId]);
  const { t } = useTranslation();

  const searchFn = useCallback(
    (p: ProductRow, q: string) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q),
    [],
  );

  const { query, setQuery, page, setPage, totalPages, paginated, showPagination } =
    useSearchPagination(products, searchFn);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
            <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink">{t.admin.productsTitle}</h1>
            <p className="mt-1 text-sm text-body">{t.admin.productsDesc}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setCreateOpen(true);
            }}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand/25 transition-colors hover:bg-brand-dark"
          >
            {t.admin.createProduct}
          </button>
        </div>
      </div>

      <div className="max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder={t.admin.searchProducts} />
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-brand/5 to-transparent text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.admin.name}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.sku}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.price}</th>
              <th className="px-4 py-3 font-semibold">{t.admin.active}</th>
              <th className="px-4 py-3 text-right font-semibold">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paginated.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-brand/[0.02]">
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-body">{p.sku}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatUsd(p.priceCents)}</td>
                <td className="px-4 py-3">
                  {p.active ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      {t.admin.yes}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
                      {t.admin.no}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateOpen(false);
                        setEditId(p.id);
                      }}
                      className="font-medium text-brand transition-colors hover:text-brand-dark"
                    >
                      {t.admin.edit}
                    </button>
                    {p.active ? (
                      <form action={deactivateProductFormAction} className="inline">
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="text-xs font-medium text-red-600 underline transition-colors hover:text-red-800">
                          {t.admin.removeFromCatalog}
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted">
                  {t.admin.noProductsFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {showPagination && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <AdminModal open={createOpen} onClose={() => setCreateOpen(false)} title={t.admin.createProductModal}>
        <ProductForm submitLabel={t.admin.create} key="create-modal" />
      </AdminModal>

      <AdminModal
        open={editId !== null && editing !== null}
        onClose={() => setEditId(null)}
        title={t.admin.editProductModal}
      >
        {editing ? (
          <ProductForm
            key={editing.id}
            submitLabel={t.admin.saveChanges}
            initial={{
              id: editing.id,
              name: editing.name,
              slug: editing.slug,
              sku: editing.sku,
              description: editing.description,
              kind: editing.kind,
              active: editing.active,
              priceUsd: editing.priceCents / 100,
            }}
          />
        ) : null}
      </AdminModal>
    </div>
  );
}

export function ProductsAdminPanel({ products }: { products: ProductRow[] }) {
  return (
    <Suspense fallback={<ProductsLoadingFallback />}>
      <ProductsAdminPanelInner products={products} />
    </Suspense>
  );
}

function ProductsLoadingFallback() {
  const { t } = useTranslation();
  return <p className="text-sm text-body">{t.admin.loadingProducts}</p>;
}
