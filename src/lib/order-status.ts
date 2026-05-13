import { OrderStatus } from "@prisma/client";

type OrderStatusDict = {
  draft: string;
  placed: string;
  quoteRequested: string;
  confirmed: string;
  invoiced: string;
  paid: string;
  cancelled: string;
  placedDesc: string;
  paidDesc: string;
  quoteRequestedDesc: string;
};

export function orderStatusLabel(status: OrderStatus, dict: OrderStatusDict): string {
  switch (status) {
    case OrderStatus.DRAFT:
      return dict.draft;
    case OrderStatus.PLACED:
      return dict.placed;
    case OrderStatus.QUOTE_REQUESTED:
      return dict.quoteRequested;
    case OrderStatus.CONFIRMED:
      return dict.confirmed;
    case OrderStatus.INVOICED:
      return dict.invoiced;
    case OrderStatus.PAID:
      return dict.paid;
    case OrderStatus.CANCELLED:
      return dict.cancelled;
    default:
      return status;
  }
}

export function orderStatusDescription(status: OrderStatus, dict: OrderStatusDict): string | null {
  switch (status) {
    case OrderStatus.PLACED:
      return dict.placedDesc;
    case OrderStatus.PAID:
      return dict.paidDesc;
    case OrderStatus.QUOTE_REQUESTED:
      return dict.quoteRequestedDesc;
    default:
      return null;
  }
}
