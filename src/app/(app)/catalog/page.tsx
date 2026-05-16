import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { CATALOG_PAGE_SIZE } from "./catalog-constants";
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";
import { CatalogShopFlow } from "./catalog-shop-flow";
import { CatalogHeader } from "./catalog-header";

export const metadata = {
  title: "Catalog",
};

type Props = { searchParams: Promise<{ page?: string; verify?: string }> };

export default async function CatalogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageRaw = parseInt(sp.page ?? "1", 10);
  const pageRequested = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const session = await getSession();
  const user =
    session?.role === "CUSTOMER"
      ? await prisma.user.findUnique({
          where: { id: session.sub },
          select: { emailVerifiedAt: true },
        })
      : null;

  const [total, allProductsMeta] = await Promise.all([
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

  const showVerifySent = sp.verify === "sent";

  return (
    <div className="space-y-10">
      <CatalogHeader />

      {session?.role === "CUSTOMER" ? (
        <EmailVerificationBanner
          emailVerified={Boolean(user?.emailVerifiedAt)}
          showSentNotice={showVerifySent}
        />
      ) : null}

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
