import { createHmac, timingSafeEqual } from "node:crypto";

const AIRWALLEX_WEBHOOK_MAX_SKEW_MS = 10 * 60 * 1000;

/**
 * Airwallex: https://www.airwallex.com/docs/developer-tools/webhooks/listen-for-webhook-events
 * `x-signature` is hex(HMAC-SHA256(secret, x-timestamp + rawBody)) (timestamp as string, then body bytes unchanged).
 * When `x-timestamp` is absent, falls back to {@link verifyStandardWebhookHmac} for local curl-style tests.
 */
export function verifyAirwallexWebhookSignature(headers: Headers, rawBody: string, secret: string | undefined): boolean {
  if (!secret || secret.length === 0) {
    return process.env.NODE_ENV !== "production";
  }

  const ts = headers.get("x-timestamp")?.trim();
  const sigHeader = headers.get("x-signature")?.trim();

  if (ts && sigHeader) {
    const valueToDigest = `${ts}${rawBody}`;
    const expectedHex = createHmac("sha256", secret).update(valueToDigest, "utf8").digest("hex");
    const tsMs = Number(ts);
    if (Number.isFinite(tsMs)) {
      if (Math.abs(Date.now() - tsMs) > AIRWALLEX_WEBHOOK_MAX_SKEW_MS) {
        return false;
      }
    }
    try {
      const a = Buffer.from(sigHeader, "hex");
      const b = Buffer.from(expectedHex, "hex");
      if (a.length !== b.length) return false;
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  return verifyStandardWebhookHmac(headers, rawBody, secret);
}

/**
 * Staging / integration testing: when a `*_WEBHOOK_SECRET` is set, require
 * `X-Webhook-Signature: sha256=<hex>` where `<hex>` is HMAC-SHA256(secret, rawBody).
 * Production PSPs often use different schemes — extend per-adapter when going live.
 */
export function verifyStandardWebhookHmac(headers: Headers, rawBody: string, secret: string | undefined): boolean {
  if (!secret || secret.length === 0) {
    return process.env.NODE_ENV !== "production";
  }

  const header =
    headers.get("x-webhook-signature") ??
    headers.get("X-Webhook-Signature") ??
    headers.get("x-signature") ??
    headers.get("X-Signature");

  if (!header) {
    return false;
  }

  const trimmed = header.trim();
  const hexPart = trimmed.startsWith("sha256=") ? trimmed.slice(7) : trimmed;
  const expectedHex = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  try {
    const a = Buffer.from(hexPart, "hex");
    const b = Buffer.from(expectedHex, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
