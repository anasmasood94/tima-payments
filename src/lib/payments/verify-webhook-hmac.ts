import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const AIRWALLEX_WEBHOOK_MAX_SKEW_MS = 10 * 60 * 1000;

function allowUnsignedWebhooks(): boolean {
  return process.env.ALLOW_UNSIGNED_WEBHOOKS === "true";
}

/**
 * Airwallex: https://www.airwallex.com/docs/developer-tools/webhooks/listen-for-webhook-events
 * `x-signature` is hex(HMAC-SHA256(secret, x-timestamp + rawBody)) (timestamp as string, then body bytes unchanged).
 * When `x-timestamp` is absent, falls back to {@link verifyStandardWebhookHmac} for local curl-style tests.
 */
export function verifyAirwallexWebhookSignature(headers: Headers, rawBody: string, secret: string | undefined): boolean {
  if (!secret || secret.length === 0) {
    return allowUnsignedWebhooks();
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
    return allowUnsignedWebhooks();
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

/**
 * Adyen: HMAC signature lives inside the notification body at `additionalData.hmacSignature`.
 * Signing string: pspReference:originalReference:merchantAccountCode:merchantReference:amount.value:amount.currency:eventCode:success
 * HMAC = Base64(HMAC-SHA256(hex2bin(hmacKey), signingString))
 */
export function verifyAdyenWebhookSignature(headers: Headers, rawBody: string, hmacKey: string | undefined): boolean {
  if (!hmacKey || hmacKey.length === 0) {
    return allowUnsignedWebhooks();
  }

  let item: Record<string, unknown>;
  try {
    const parsed = JSON.parse(rawBody);
    item =
      parsed?.notificationItems?.[0]?.NotificationRequestItem ??
      parsed?.NotificationRequestItem ??
      parsed;
  } catch {
    return false;
  }

  const additional = item.additionalData as Record<string, unknown> | undefined;
  const providedSig = typeof additional?.hmacSignature === "string" ? additional.hmacSignature : null;
  if (!providedSig) {
    return verifyStandardWebhookHmac(headers, rawBody, hmacKey);
  }

  const amount = item.amount as Record<string, unknown> | undefined;
  const fields = [
    String(item.pspReference ?? ""),
    String(item.originalReference ?? ""),
    String(item.merchantAccountCode ?? ""),
    String(item.merchantReference ?? ""),
    String(amount?.value ?? ""),
    String(amount?.currency ?? ""),
    String(item.eventCode ?? ""),
    String(item.success ?? ""),
  ];
  const signingString = fields.join(":");

  const keyBytes = Buffer.from(hmacKey, "hex");
  const expectedSig = createHmac("sha256", keyBytes).update(signingString, "utf8").digest("base64");

  try {
    const a = Buffer.from(providedSig, "base64");
    const b = Buffer.from(expectedSig, "base64");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Worldpay: webhook callbacks use HTTP Basic Authentication.
 * Credentials are separate from API credentials (WORLDPAY_WEBHOOK_USERNAME / WORLDPAY_WEBHOOK_PASSWORD).
 */
export function verifyWorldpayWebhookAuth(headers: Headers, rawBody: string): boolean {
  const username = process.env.WORLDPAY_WEBHOOK_USERNAME;
  const password = process.env.WORLDPAY_WEBHOOK_PASSWORD;

  if (!username && !password) {
    return allowUnsignedWebhooks();
  }

  const authHeader = headers.get("authorization") ?? headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  let decoded: string;
  try {
    decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }

  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1) return false;

  const providedUser = decoded.slice(0, colonIdx);
  const providedPass = decoded.slice(colonIdx + 1);

  const expectedUser = username ?? "";
  const expectedPass = password ?? "";

  const userMatch = safeEqual(providedUser, expectedUser);
  const passMatch = safeEqual(providedPass, expectedPass);
  return userMatch && passMatch;
}

/**
 * CyberSource: webhook signature in `v-c-signature` or `x-pay-token` header.
 * Signature = Base64(HMAC-SHA256(webhookSecret, rawBody))
 */
export function verifyCybersourceWebhookSignature(headers: Headers, rawBody: string, secret: string | undefined): boolean {
  if (!secret || secret.length === 0) {
    return allowUnsignedWebhooks();
  }

  const sig =
    headers.get("v-c-signature") ??
    headers.get("V-C-Signature") ??
    headers.get("x-pay-token") ??
    headers.get("X-Pay-Token");

  if (!sig) {
    return verifyStandardWebhookHmac(headers, rawBody, secret);
  }

  const expectedSig = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  try {
    const a = Buffer.from(sig.trim(), "base64");
    const b = Buffer.from(expectedSig, "base64");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Nuvei (SafeCharge): checksum is inside the POST body, not a header.
 * checksum = SHA-256(secretKey + totalAmount + currency + responseTimeStamp + PPP_TransactionID + Status + productId)
 */
export function verifyNuveiWebhookChecksum(rawBody: string, secretKey: string | undefined): boolean {
  if (!secretKey || secretKey.length === 0) {
    return allowUnsignedWebhooks();
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return false;
  }

  const providedChecksum =
    typeof body.advanceResponseChecksum === "string"
      ? body.advanceResponseChecksum
      : typeof body.checksum === "string"
        ? body.checksum
        : null;
  if (!providedChecksum) return false;

  const totalAmount = String(body.totalAmount ?? body.amount ?? "");
  const currency = String(body.currency ?? "");
  const responseTimeStamp = String(body.responseTimeStamp ?? body.responsetimestamp ?? "");
  const pppTransactionId = String(body.PPP_TransactionID ?? body.ppp_transactionid ?? body.TransactionID ?? body.transactionId ?? "");
  const status = String(body.Status ?? body.status ?? "");
  const productId = String(body.productId ?? body.product_id ?? "");

  const concat = `${secretKey}${totalAmount}${currency}${responseTimeStamp}${pppTransactionId}${status}${productId}`;
  const expectedHex = createHash("sha256").update(concat, "utf8").digest("hex");

  return safeEqual(providedChecksum.toLowerCase(), expectedHex.toLowerCase());
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    const padded = Buffer.alloc(bufA.length, 0);
    bufB.copy(padded, 0, 0, Math.min(bufB.length, bufA.length));
    timingSafeEqual(bufA, padded);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}
