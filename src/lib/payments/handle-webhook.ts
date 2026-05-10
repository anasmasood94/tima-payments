import { PaymentGatewayId, PaymentStatus, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/db";
import { getAdapterByGatewayId } from "./registry";
import { applyPaymentStatusByProviderRef } from "./apply-payment-status";
import { parseWebhookBody } from "./parse-webhook-body";
import { webhookIdempotencyKey } from "./webhook-idempotency";

function extractEventId(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") return null;
  const o = parsed as Record<string, unknown>;
  const candidates = ["id", "eventId", "event_id", "requestID", "requestId", "pspReference", "merchantReferenceCode"];
  for (const k of candidates) {
    const v = o[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

function toJsonPayload(parsed: unknown): Prisma.InputJsonValue {
  if (parsed === null || parsed === undefined) return {};
  if (typeof parsed === "object") return parsed as Prisma.InputJsonValue;
  return { _scalar: String(parsed) };
}

export async function handleProviderWebhook(gatewayId: PaymentGatewayId, req: Request) {
  const raw = await req.text();
  const adapter = getAdapterByGatewayId(gatewayId);

  if (!adapter.verifyWebhookRequest(req.headers, raw)) {
    return new Response("invalid signature", { status: 401 });
  }

  const parsed = parseWebhookBody(raw, gatewayId);
  if (parsed === null) {
    return new Response("invalid body", { status: 400 });
  }

  const idempotencyKey = webhookIdempotencyKey(gatewayId, raw);
  const normalized = adapter.parseWebhookPayload(parsed);

  let deliveryId: string;
  try {
    const row = await prisma.webhookDelivery.create({
      data: {
        gateway: gatewayId,
        idempotencyKey,
        eventId: extractEventId(parsed),
        payload: toJsonPayload(parsed),
        handled: false,
      },
    });
    deliveryId = row.id;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return Response.json({ received: true, duplicate: true });
    }
    throw e;
  }

  if (!normalized) {
    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: { handled: true },
    });
    return Response.json({ received: true, ignored: true });
  }

  const terminal =
    normalized.status === PaymentStatus.SUCCEEDED ||
    normalized.status === PaymentStatus.FAILED ||
    normalized.status === PaymentStatus.REFUNDED ||
    normalized.status === PaymentStatus.CANCELED;

  if (!terminal) {
    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: { handled: true },
    });
    return Response.json({ received: true, deferred: true });
  }

  const result = await applyPaymentStatusByProviderRef({
    gatewayId,
    providerPaymentId: normalized.providerPaymentId,
    status: normalized.status,
  });

  await prisma.webhookDelivery.update({
    where: { id: deliveryId },
    data: {
      handled: true,
      processingError: result.ok ? null : result.reason,
    },
  });

  return Response.json({ received: true, applied: result.ok });
}
