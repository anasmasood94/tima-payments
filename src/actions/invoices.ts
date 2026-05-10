"use server";

import { InvoiceStatus, OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${year}-${suffix}`;
}

export async function issueInvoiceForOrder(orderId: string, amountOverrideCents: number | null = null) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { lines: true, invoices: true },
  });

  if (!order) {
    return { error: "Order not found." };
  }

  if (order.status === OrderStatus.PAID) {
    return { error: "Order is already paid." };
  }

  if (order.status === OrderStatus.PLACED) {
    return { error: "This order is waiting for customer checkout. You cannot issue a second invoice until checkout completes or the order is updated." };
  }

  if (order.lines.length === 0) {
    return { error: "Order has no line items." };
  }

  const issued = order.invoices.find((i) => i.status === InvoiceStatus.ISSUED);
  if (issued) {
    return { error: "An issued invoice already exists for this order." };
  }

  const computedCents = order.lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const amountCents = amountOverrideCents !== null ? amountOverrideCents : computedCents;

  if (amountCents < 1) {
    return { error: "Invoice amount must be at least $0.01." };
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const number = nextInvoiceNumber();
    try {
      await prisma.$transaction(async (tx) => {
        await tx.invoice.create({
          data: {
            orderId: order.id,
            number,
            status: InvoiceStatus.ISSUED,
            amountCents,
            currency: "USD",
            dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });
        await tx.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.INVOICED },
        });
      });
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/orders");
      revalidatePath("/admin/invoices");
      revalidatePath("/portal");
      redirect(`/admin/orders/${orderId}?issued=1`);
    } catch (e: unknown) {
      const code =
        typeof e === "object" && e !== null && "code" in e ? (e as { code?: string }).code : undefined;
      if (code === "P2002") {
        continue;
      }
      throw e;
    }
  }

  return { error: "Could not allocate an invoice number. Try again." };
}

export async function issueInvoiceFormAction(_prev: unknown, formData: FormData) {
  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || !orderId) {
    return { error: "Missing order." };
  }

  const totalRaw = formData.get("invoiceTotalUsd");
  let amountOverrideCents: number | null = null;
  if (typeof totalRaw === "string" && totalRaw.trim()) {
    const n = Number(totalRaw);
    if (!Number.isFinite(n) || n < 0.01) {
      return { error: "Invoice total must be a number ≥ 0.01 when provided." };
    }
    amountOverrideCents = Math.round(n * 100);
  }

  return issueInvoiceForOrder(orderId, amountOverrideCents);
}
