import { getPaymentGatewayAdapter } from "./registry";
import type { PaymentGatewayAdapter } from "./types";

/**
 * Gateway used when the customer pays right after placing a catalog order.
 * Reads the admin-chosen gateway from the database.
 */
export async function getOrderCheckoutAdapter(): Promise<PaymentGatewayAdapter> {
  return getPaymentGatewayAdapter();
}
