import { OrderStatus } from "@prisma/client";

/** Customer- and admin-facing labels for lifecycle states. */
export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.DRAFT:
      return "Draft";
    case OrderStatus.PLACED:
      return "Placed — pay now";
    case OrderStatus.QUOTE_REQUESTED:
      return "Quote requested";
    case OrderStatus.CONFIRMED:
      return "Confirmed";
    case OrderStatus.INVOICED:
      return "Invoiced";
    case OrderStatus.PAID:
      return "Paid";
    case OrderStatus.CANCELLED:
      return "Cancelled";
    default:
      return status;
  }
}

export function orderStatusDescription(status: OrderStatus): string | null {
  switch (status) {
    case OrderStatus.PLACED:
      return "Complete checkout to confirm your order. Card entry happens on your payment provider.";
    case OrderStatus.PAID:
      return "Payment received — order confirmed.";
    case OrderStatus.QUOTE_REQUESTED:
      return "We will review and send an invoice when ready.";
    default:
      return null;
  }
}
