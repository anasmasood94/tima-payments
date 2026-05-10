"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductKind } from "@prisma/client";
import { AdminModal } from "@/components/admin-modal";
import { formatUsd } from "@/lib/format";
import { deactivateProductFormAction } from "@/actions/admin-products";
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

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Products &amp; services</h1>
          <p className="mt-1 text-sm text-body">Slug and SKU must stay unique.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setCreateOpen(true);
            }}
            className="rounded-md bg-brick px-4 py-2 text-sm font-medium text-white hover:bg-brick/90"
          >
            Create product
          </button>
          <Link href="/admin" className="text-sm text-body underline">
            ← Admin
          </Link>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-body">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-2 text-body">{p.sku}</td>
                <td className="px-4 py-2">{formatUsd(p.priceCents)}</td>
                <td className="px-4 py-2">{p.active ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateOpen(false);
                        setEditId(p.id);
                      }}
                      className="font-medium text-ink underline"
                    >
                      Edit
                    </button>
                    {p.active ? (
                      <form action={deactivateProductFormAction} className="inline">
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="text-xs font-medium text-red-700 underline">
                          Remove from catalog
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <AdminModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create product">
        <ProductForm submitLabel="Create" key="create-modal" />
      </AdminModal>

      <AdminModal
        open={editId !== null && editing !== null}
        onClose={() => setEditId(null)}
        title="Edit product"
      >
        {editing ? (
          <ProductForm
            key={editing.id}
            submitLabel="Save changes"
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
    <Suspense fallback={<p className="text-sm text-body">Loading products…</p>}>
      <ProductsAdminPanelInner products={products} />
    </Suspense>
  );
}
