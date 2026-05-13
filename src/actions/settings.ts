"use server";

import { PaymentGatewayId } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

const gatewaySchema = z.object({
  gateway: z.nativeEnum(PaymentGatewayId),
});

const ACTIVE_GATEWAY_KEY = "active_payment_gateway";
const ALLOWED_GATEWAYS = new Set<string>([
  PaymentGatewayId.AIRWALLEX,
  PaymentGatewayId.NUVEI,
]);

export async function getActiveGatewayId(): Promise<PaymentGatewayId> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: ACTIVE_GATEWAY_KEY },
  });
  if (row && ALLOWED_GATEWAYS.has(row.value)) {
    return row.value as PaymentGatewayId;
  }
  return PaymentGatewayId.AIRWALLEX;
}

export async function updateActiveGatewayAction(
  _prev: unknown,
  formData: FormData,
) {
  await requireAdmin();

  const parsed = gatewaySchema.safeParse({ gateway: formData.get("gateway") });
  if (!parsed.success) {
    return { error: "Invalid gateway." };
  }
  const { gateway } = parsed.data;
  if (!ALLOWED_GATEWAYS.has(gateway)) {
    return { error: "Invalid gateway." };
  }

  await prisma.siteSetting.upsert({
    where: { key: ACTIVE_GATEWAY_KEY },
    update: { value: gateway },
    create: { key: ACTIVE_GATEWAY_KEY, value: gateway },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  return { ok: true, gateway };
}
