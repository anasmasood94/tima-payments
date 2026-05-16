"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/password-reset";
import { useTranslation } from "@/lib/i18n/language-context";

const field =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(
    forgotPasswordAction,
    null as { error?: string; success?: string } | null,
  );
  const { t } = useTranslation();

  return (
    <form action={action} className="space-y-5">
      {state?.error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {state.success}
        </p>
      ) : null}

      <div>
        <label htmlFor="forgot-email" className="block text-base font-bold leading-tight text-ink">
          {t.auth.email}
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.auth.emailPlaceholder}
          className={field}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
      >
        {t.auth.sendResetLink}
      </button>
    </form>
  );
}
