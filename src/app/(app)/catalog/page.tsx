import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { CATALOG_PAGE_SIZE } from "./catalog-constants";
import { CatalogShopFlow } from "./catalog-shop-flow";

export const metadata = {
  title: "Catalog",
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function CatalogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageRaw = parseInt(sp.page ?? "1", 10);
  const pageRequested = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const [session, total, allProductsMeta] = await Promise.all([
    getSession(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, priceCents: true, kind: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  const page = Math.min(pageRequested, totalPages);
  if (page !== pageRequested && total > 0) {
    redirect(`/catalog?page=${page}#shop`);
  }

  const skip = (page - 1) * CATALOG_PAGE_SIZE;
  const products =
    total === 0
      ? []
      : await prisma.product.findMany({
          where: { active: true },
          orderBy: { name: "asc" },
          skip,
          take: CATALOG_PAGE_SIZE,
          select: { id: true, slug: true, name: true, description: true, priceCents: true, kind: true },
        });

  const allProductIds = allProductsMeta.map((p) => p.id);

  const signedIn = Boolean(session);
  const isCustomer = session?.role === "CUSTOMER";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Services &amp; products</h1>
          <p className="mt-2 max-w-2xl text-sm text-body">
            Pick quantities below, then place an order or request a quote. Payment always happens on your payment
            provider&apos;s hosted pages after we issue an invoice — never by entering a card here.
          </p>
        </div>
        <Link href="/portal" className="text-sm font-medium text-body underline">
          My account
        </Link>
      </div>

      <CatalogShopFlow
        products={products}
        allProductIds={allProductIds}
        allProductsMeta={allProductsMeta}
        signedIn={signedIn}
        isCustomer={isCustomer}
        page={page}
        totalPages={totalPages}
        totalItems={total}
      />
    </div>
  );
}
