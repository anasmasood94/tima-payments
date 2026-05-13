import { PaymentGatewayId } from "@prisma/client";
import { adyenGateway } from "./adyen-gateway";
import { airwallexGateway } from "./airwallex-gateway";
import { cybersourceGateway } from "./cybersource-gateway";
import { mockGateway } from "./mock-gateway";
import { nuveiGateway } from "./nuvei-gateway";
import { worldpayGateway } from "./worldpay-gateway";
import type { PaymentGatewayAdapter } from "./types";
import { getActiveGatewayId } from "@/actions/settings";

/**
 * Env-based fallback (kept for backward compat; DB setting takes priority).
 */
export function resolvePaymentGatewayIdFromEnv(): PaymentGatewayId {
  let raw = (process.env.ORDER_CHECKOUT_GATEWAY ?? "AIRWALLEX").toUpperCase().trim();
  if (raw === "MOCK") raw = "AIRWALLEX";
  const allowed = new Set(
    (Object.values(PaymentGatewayId) as string[]).filter((g) => g !== PaymentGatewayId.MOCK),
  );
  return allowed.has(raw) ? (raw as PaymentGatewayId) : PaymentGatewayId.AIRWALLEX;
}

/** Resolve the admin-chosen gateway from the DB. */
export async function resolveActiveGatewayId(): Promise<PaymentGatewayId> {
  return getActiveGatewayId();
}

/** Invoice "Pay with hosted checkout" — reads admin-chosen gateway from DB. */
export async function getPaymentGatewayAdapter(): Promise<PaymentGatewayAdapter> {
  const id = await resolveActiveGatewayId();
  return getAdapterByGatewayId(id);
}

export function getAdapterByGatewayId(id: PaymentGatewayId): PaymentGatewayAdapter {
  switch (id) {
    case PaymentGatewayId.AIRWALLEX:
      return airwallexGateway;
    case PaymentGatewayId.ADYEN:
      return adyenGateway;
    case PaymentGatewayId.WORLDPAY:
      return worldpayGateway;
    case PaymentGatewayId.CYBERSOURCE:
      return cybersourceGateway;
    case PaymentGatewayId.NUVEI:
      return nuveiGateway;
    case PaymentGatewayId.MOCK:
      return mockGateway;
    default: {
      const _n: never = id;
      void _n;
      return airwallexGateway;
    }
  }
}
