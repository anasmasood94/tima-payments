"use client";

import { useState, useActionState } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { updateActiveGatewayAction } from "@/actions/settings";

const GATEWAYS = [
  { id: "AIRWALLEX", labelKey: "gatewayAirwallex" as const },
  { id: "NUVEI", labelKey: "gatewayNuvei" as const },
];

export function GatewaySelector({ activeGateway }: { activeGateway: string }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(activeGateway);
  const [state, formAction, isPending] = useActionState(
    updateActiveGatewayAction,
    null as { ok?: boolean; error?: string; gateway?: string } | null,
  );

  const saved = state?.ok && state.gateway ? state.gateway : activeGateway;
  const hasChanges = selected !== saved;

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm(t.admin.gatewaySaveConfirm)) {
      e.preventDefault();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{t.admin.settingsTitle}</h1>
        <p className="mt-1 text-sm text-body">{t.admin.settingsDesc}</p>
      </div>

      <div className="max-w-md rounded-xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-ink">{t.admin.activeGateway}</h2>

        <div className="mt-4 space-y-3">
          {GATEWAYS.map((gw) => (
            <button
              key={gw.id}
              type="button"
              onClick={() => setSelected(gw.id)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                selected === gw.id
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                  : "border-line bg-white text-ink hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected === gw.id ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {selected === gw.id && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </span>
              {t.admin[gw.labelKey]}
            </button>
          ))}
        </div>

        <form action={formAction} onSubmit={handleSave} className="mt-5">
          <input type="hidden" name="gateway" value={selected} />
          <button
            type="submit"
            disabled={!hasChanges || isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? t.admin.saving : t.admin.saveChanges}
          </button>
        </form>

        {state?.ok && !hasChanges && (
          <p className="mt-4 text-sm font-medium text-green-600">{t.admin.gatewaySaved}</p>
        )}
        {state?.error && (
          <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>
        )}
      </div>
    </div>
  );
}
