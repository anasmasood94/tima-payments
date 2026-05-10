import { getAdapterByGatewayId, resolvePaymentGatewayIdFromEnv } from "./registry";
import type { PaymentGatewayAdapter } from "./types";

/**
 * Gateway used when the customer pays right after placing a catalog order (before fulfillment).
 * Same env as invoice checkout: `ORDER_CHECKOUT_GATEWAY` (see `resolvePaymentGatewayIdFromEnv`).
 */
export function getOrderCheckoutAdapter(): PaymentGatewayAdapter {
  return getAdapterByGatewayId(resolvePaymentGatewayIdFromEnv());
}
