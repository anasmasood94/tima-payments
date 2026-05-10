import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatUsd } from "@/lib/format";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/catalog" className="text-sm text-zinc-600 underline">
        ← Back to catalog
      </Link>
      <p className="text-xs font-medium uppercase text-zinc-500">{product.kind}</p>
      <h1 className="text-3xl font-semibold text-zinc-900">{product.name}</h1>
      <p className="text-sm text-zinc-600">SKU {product.sku}</p>
      <p className="text-lg font-medium text-zinc-900">{formatUsd(product.priceCents)}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{product.description}</p>
      <p className="text-sm text-zinc-600">
        To purchase, set quantities on the{" "}
        <Link href="/catalog#shop" className="font-medium underline">
          catalog
        </Link>{" "}
        page and submit an order or quote. After we issue an invoice, pay from{" "}
        <Link href="/portal" className="font-medium underline">
          your portal
        </Link>{" "}
        using hosted checkout.
      </p>
    </div>
  );
}
