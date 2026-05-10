"use server";

import { ProductKind } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  sku: z.string().min(1).max(80),
  description: z.string().min(1).max(8000),
  priceUsd: z.coerce.number().positive(),
  kind: z.enum(["PRODUCT", "SERVICE"]),
  active: z.coerce.boolean().optional().default(true),
});

export async function upsertProductAction(_prev: unknown, formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    priceUsd: formData.get("priceUsd"),
    kind: formData.get("kind"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return { error: "Invalid product data." };
  }

  const priceCents = Math.round(parsed.data.priceUsd * 100);
  const kind = parsed.data.kind === "SERVICE" ? ProductKind.SERVICE : ProductKind.PRODUCT;

  try {
    if (typeof id === "string" && id.length > 0) {
      await prisma.product.update({
        where: { id },
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          sku: parsed.data.sku,
          description: parsed.data.description,
          priceCents,
          kind,
          active: parsed.data.active,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          sku: parsed.data.sku,
          description: parsed.data.description,
          priceCents,
          kind,
          active: parsed.data.active,
        },
      });
    }
  } catch (e: unknown) {
    const code =
      typeof e === "object" && e !== null && "code" in e ? (e as { code?: string }).code : undefined;
    if (code === "P2002") {
      return { error: "Slug or SKU is already in use." };
    }
    throw e;
  }

  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deactivateProductFormAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirect("/admin/products");
  }

  await prisma.product.update({
    where: { id },
    data: { active: false },
  });

  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
