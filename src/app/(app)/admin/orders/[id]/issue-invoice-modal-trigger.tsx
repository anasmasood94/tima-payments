"use client";

import { useState } from "react";
import { AdminModal } from "@/components/admin-modal";
import { IssueInvoiceForm } from "./issue-invoice-form";

type Props = {
  orderId: string;
  computedSubtotalCents: number;
};

export function IssueInvoiceModalTrigger({ orderId, computedSubtotalCents }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-brick px-4 py-2 text-sm font-medium text-white hover:bg-brick/90"
      >
        Issue invoice
      </button>
      <AdminModal open={open} onClose={() => setOpen(false)} title="Issue invoice">
        <IssueInvoiceForm orderId={orderId} computedSubtotalCents={computedSubtotalCents} />
      </AdminModal>
    </>
  );
}
