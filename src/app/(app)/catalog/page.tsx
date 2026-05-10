import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { CatalogShopFlow } from "./catalog-shop-flow";

export const metadata = {
  title: "Catalog",
};

export default async function CatalogPage() {
  const [session, products] = await Promise.all([
    getSession(),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, description: true, priceCents: true, kind: true },
    }),
  ]);

  const signedIn = Boolean(session);
  const isCustomer = session?.role === "CUSTOMER";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Services &amp; products</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Pick quantities below, then place an order or request a quote. Payment always happens on your payment
            provider&apos;s hosted pages after we issue an invoice — never by entering a card here.
          </p>
        </div>
        <Link href="/portal" className="text-sm font-medium text-zinc-700 underline">
          Customer portal
        </Link>
      </div>

      <CatalogShopFlow products={products} signedIn={signedIn} isCustomer={isCustomer} />
    </div>
  );
}
