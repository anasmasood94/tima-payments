/**
 * Server-only Airwallex REST helpers (API key). Do not import from client components.
 */

/** ISO 4217 currencies with zero minor units (DB value is already whole currency units). */
const ZERO_MINOR_UNIT_CURRENCIES = new Set([
  "BIF", "CLP", "DJF", "GNF", "ISK", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "UGX", "UYI", "VND", "VUV", "XAF", "XOF", "XPF",
]);

const THREE_MINOR_UNIT_CURRENCIES = new Set(["BHD", "IQD", "JOD", "KWD", "LYD", "OMR", "TND"]);

/**
 * Airwallex `POST /pa/payment_intents/create` expects `amount` in **major** units (e.g. USD `1.9` for $1.90),
 * not smallest units. Our app stores USD (etc.) as integer **cents** in `amountCents`.
 * @see https://www.airwallex.com/docs/payments/get-started/using-payments-intent-api
 */
export function airwallexAmountMajorFromStoreCents(amountSmallest: number, currency: string): number {
  const c = currency.toUpperCase();
  if (ZERO_MINOR_UNIT_CURRENCIES.has(c)) return Math.round(amountSmallest);
  if (THREE_MINOR_UNIT_CURRENCIES.has(c)) return Math.round(amountSmallest) / 1000;
  return Math.round(amountSmallest) / 100;
}

export function airwallexApiBase() {
  return process.env.AIRWALLEX_API_BASE?.replace(/\/$/, "") ?? "https://api-demo.airwallex.com";
}

export type AirwallexLoginDetailedResult =
  | { ok: true; token: string }
  | { ok: false; reason: "missing_env" }
  | { ok: false; reason: "http"; status: number; message?: string }
  | { ok: false; reason: "no_token_in_body" };

/**
 * POST /api/v1/authentication/login — returns bearer token or structured failure (for support / UI hints).
 */
export async function airwallexLoginDetailed(): Promise<AirwallexLoginDetailedResult> {
  const clientId = process.env.AIRWALLEX_CLIENT_ID?.trim();
  const apiKey = process.env.AIRWALLEX_API_KEY?.trim();
  if (!clientId || !apiKey) {
    return { ok: false, reason: "missing_env" };
  }

  const res = await fetch(`${airwallexApiBase()}/api/v1/authentication/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-api-key": apiKey,
    },
    body: "{}",
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return {
      ok: false,
      reason: "http",
      status: res.status,
      message: "Airwallex login response was not valid JSON.",
    };
  }

  const record = body as Record<string, unknown>;
  if (!res.ok) {
    const message =
      typeof record.message === "string"
        ? record.message
        : typeof record.code === "string"
          ? record.code
          : typeof record.error === "string"
            ? record.error
            : undefined;
    return { ok: false, reason: "http", status: res.status, message };
  }

  const token = typeof record.token === "string" ? record.token : null;
  if (!token) {
    return { ok: false, reason: "no_token_in_body" };
  }
  return { ok: true, token };
}

export async function airwallexLoginBearer(): Promise<string | null> {
  const r = await airwallexLoginDetailed();
  return r.ok ? r.token : null;
}

export type AirwallexRetrievedIntent = {
  id: string;
  currency: string;
  status: string;
  client_secret?: string;
};

export async function retrieveAirwallexPaymentIntent(
  intentId: string,
): Promise<AirwallexRetrievedIntent | null> {
  const token = await airwallexLoginBearer();
  if (!token) return null;

  const res = await fetch(`${airwallexApiBase()}/api/v1/pa/payment_intents/${encodeURIComponent(intentId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, unknown>;
  const id = typeof data.id === "string" ? data.id : null;
  if (!id) return null;
  const currency = typeof data.currency === "string" ? data.currency : "USD";
  const status = typeof data.status === "string" ? data.status : "";
  const client_secret = typeof data.client_secret === "string" ? data.client_secret : undefined;
  return { id, currency, status, client_secret };
}
