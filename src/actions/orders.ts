"use server";

import { InvoiceStatus, OrderStatus, PaymentStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { getOrderCheckoutAdapter } from "@/lib/payments/order-checkout";

function parseCatalogQuantities(formData: FormData): { productId: string; quantity: number }[] {
  const lines: { productId: string; quantity: number }[] = [];
  for (const [key, val] of formData.entries()) {
    if (!key.startsWith("qty_")) continue;
    const productId = key.slice(4);
    const quantity = Number(val);
    if (!Number.isFinite(quantity) || quantity <= 0) continue;
    lines.push({ productId, quantity: Math.floor(quantity) });
  }
  return lines;
}

function nextWebInvoiceNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WEB-${year}-${suffix}`;
}

export async function createOrderFromCatalogForm(_prev: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Please sign in to place an order or request a quote." };
  }
  if (session.role !== "CUSTOMER") {
    return { error: "Only customer accounts can place catalog orders." };
  }

  const intent = formData.get("intent");
  const lines = parseCatalogQuantities(formData);
  if (lines.length === 0) {
    return { error: "Add at least one item with quantity greater than zero." };
  }

  const notesRaw = formData.get("notes");
  const notes = typeof notesRaw === "string" && notesRaw.trim() ? notesRaw.trim() : null;

  const productIds = [...new Set(lines.map((l) => l.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    return { error: "One or more products are unavailable." };
  }

  const priceById = new Map(products.map((p) => [p.id, p.priceCents]));

  const orderLines = lines.map((l) => ({
    productId: l.productId,
    quantity: l.quantity,
    unitPriceCents: priceById.get(l.productId)!,
  }));

  const amountCents = orderLines.reduce((s, l) => s + l.quantity * l.unitPriceCents, 0);

  /** Quote path: no immediate payment. */
  if (intent === "quote") {
    await prisma.order.create({
      data: {
        userId: session.sub,
        status: OrderStatus.QUOTE_REQUESTED,
        notes,
        lines: { create: orderLines },
      },
    });

    revalidatePath("/portal");
    revalidatePath("/admin/orders");
    revalidatePath("/catalog");
    redirect("/portal?created=1");
  }

  /** Order path: placed → checkout → paid via webhook / simulator. */
  const adapter = await getOrderCheckoutAdapter();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.sub } });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { order, payment, invoice } = await prisma.$transaction(async (tx) => {
    const orderRow = await tx.order.create({
      data: {
        userId: session.sub,
        status: OrderStatus.PLACED,
        notes,
        lines: { create: orderLines },
      },
    });

    let invoiceRow = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      const number = nextWebInvoiceNumber();
      try {
        invoiceRow = await tx.invoice.create({
          data: {
            orderId: orderRow.id,
            number,
            status: InvoiceStatus.DRAFT,
            amountCents,
            currency: "USD",
          },
        });
        break;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
          continue;
        }
        throw e;
      }
    }

    if (!invoiceRow) {
      throw new Error("Could not allocate invoice number.");
    }

    const paymentRow = await tx.payment.create({
      data: {
        invoiceId: invoiceRow.id,
        gateway: adapter.gatewayId,
        status: PaymentStatus.PENDING,
        amountCents,
        currency: "USD",
      },
    });

    return { order: orderRow, payment: paymentRow, invoice: invoiceRow };
  });

  const returnUrl = `${appUrl}/portal/orders/${order.id}?checkout=complete`;
  const cancelUrl = `${appUrl}/portal/orders/${order.id}?checkout=cancelled`;

  const checkout = await adapter.createHostedCheckout({
    paymentId: payment.id,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    orderId: order.id,
    amountCents,
    currency: invoice.currency,
    customerEmail: user.email,
    returnUrl,
    cancelUrl,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      hostedCheckoutUrl: checkout.hostedCheckoutUrl,
      providerPaymentId: checkout.providerPaymentId,
      metadata: checkout.metadata as object | undefined,
    },
  });

  revalidatePath("/portal");
  revalidatePath("/admin/orders");
  revalidatePath("/catalog");
  redirect(checkout.hostedCheckoutUrl);
}
