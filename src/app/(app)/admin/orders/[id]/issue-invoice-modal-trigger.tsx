"use client";

import { useState } from "react";
import { AdminModal } from "@/components/admin-modal";
import { IssueInvoiceForm } from "./issue-invoice-form";
import { useTranslation } from "@/lib/i18n/language-context";

type Props = {
  orderId: string;
  computedSubtotalCents: number;
};

export function IssueInvoiceModalTrigger({ orderId, computedSubtotalCents }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        {t.adminOrder.issueInvoice}
      </button>
      <AdminModal open={open} onClose={() => setOpen(false)} title={t.adminOrder.issueInvoice}>
        <IssueInvoiceForm orderId={orderId} computedSubtotalCents={computedSubtotalCents} />
      </AdminModal>
    </>
  );
}
