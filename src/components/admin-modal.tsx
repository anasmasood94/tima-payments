"use client";

import { useEffect, useRef } from "react";

type AdminModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Native `<dialog>` must not use `display: flex` etc. on the root — that overrides the
 * UA `display: none` when closed and leaves the modal visible. Flex centering lives on
 * an inner `fixed` layer instead.
 */
export function AdminModal({ open, title, onClose, children }: AdminModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="m-0 max-h-none max-w-none border-0 bg-transparent p-0 shadow-none outline-none [&::backdrop]:bg-zinc-900/40"
      onClose={onClose}
    >
      <div
        className="fixed inset-0 z-0 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="z-10 flex max-h-[min(90vh,calc(100%-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3">
            <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
            <button
              type="button"
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden className="text-xl leading-none">
                ×
              </span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </dialog>
  );
}
