"use server";

import { prisma } from "@/lib/db";
import { ServiceCategory, Prisma } from "@prisma/client";

export type ProductSearchResult = {
  id: string;
  name: string;
  description: string;
  sku: string;
  priceCents: number;
  currency: string;
  kind: string;
  category: ServiceCategory | null;
  imageUrl: string | null;
};

export async function searchProducts(
  query: string,
  category?: ServiceCategory | null,
): Promise<ProductSearchResult[]> {
  const where: Prisma.ProductWhereInput = { active: true };

  if (query.trim()) {
    const term = `%${query.trim()}%`;
    where.OR = [
      { name: { contains: query.trim(), mode: "insensitive" } },
      { description: { contains: query.trim(), mode: "insensitive" } },
      { sku: { contains: query.trim(), mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
    take: 50,
    select: {
      id: true,
      name: true,
      description: true,
      sku: true,
      priceCents: true,
      currency: true,
      kind: true,
      category: true,
      imageUrl: true,
    },
  });

  return products;
}

export async function getCategories(): Promise<
  { category: ServiceCategory; count: number }[]
> {
  const results = await prisma.product.groupBy({
    by: ["category"],
    where: { active: true, category: { not: null } },
    _count: { id: true },
    orderBy: { category: "asc" },
  });

  return results
    .filter((r) => r.category !== null)
    .map((r) => ({
      category: r.category!,
      count: r._count.id,
    }));
}
