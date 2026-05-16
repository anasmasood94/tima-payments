"use client";

import { useActionState } from "react";
import { resendVerificationAction } from "@/actions/auth";
import { useTranslation } from "@/lib/i18n/language-context";

export function EmailVerificationBanner({
  emailVerified,
  showSentNotice,
}: {
  emailVerified: boolean;
  showSentNotice?: boolean;
}) {
  const { t } = useTranslation();
  const [state, action, pending] = useActionState(
    resendVerificationAction,
    null as { error?: string; success?: string } | null,
  );

  if (emailVerified) return null;

  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">{t.auth.verifyEmailTitle}</p>
      <p className="mt-1">
        {showSentNotice ? t.auth.verifyEmailSent : t.auth.verifyEmailPrompt}
      </p>
      {state?.error ? <p className="mt-2 text-red-800">{state.error}</p> : null}
      {state?.success ? <p className="mt-2 text-emerald-900">{state.success}</p> : null}
      <form action={action} className="mt-3">
        <button
          type="submit"
          disabled={pending}
          className="font-semibold text-brand underline-offset-2 hover:underline disabled:opacity-60"
        >
          {pending ? t.auth.sending : t.auth.resendVerification}
        </button>
      </form>
    </div>
  );
}
