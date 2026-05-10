import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { ProductsAdminPanel } from "./products-admin-panel";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });

  return <ProductsAdminPanel products={products} />;
}
