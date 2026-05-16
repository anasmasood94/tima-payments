"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/actions/password-reset";
import { useTranslation } from "@/lib/i18n/language-context";

const field =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, null as { error?: string } | null);
  const { t } = useTranslation();

  if (!token) {
    return (
      <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
        {t.auth.resetLinkInvalid}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      {state?.error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div>
        <label htmlFor="reset-password" className="block text-base font-bold leading-tight text-ink">
          {t.auth.newPassword} <span className="font-normal text-muted">{t.auth.passwordMin}</span>
        </label>
        <input
          id="reset-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={field}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
      >
        {t.auth.setNewPassword}
      </button>
    </form>
  );
}
