import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductDetailContent } from "./product-detail-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name ?? "Product" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.active) {
    notFound();
  }

  return (
    <ProductDetailContent
      product={{
        name: product.name,
        kind: product.kind,
        sku: product.sku,
        priceCents: product.priceCents,
        description: product.description,
      }}
    />
  );
}
