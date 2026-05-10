import { createHash } from "node:crypto";
import type { PaymentGatewayId } from "@prisma/client";

/** Stable key for the same raw PSP payload (replay-safe). */
export function webhookIdempotencyKey(gateway: PaymentGatewayId, rawBody: string): string {
  return createHash("sha256").update(`${gateway}\n${rawBody}`).digest("hex");
}
