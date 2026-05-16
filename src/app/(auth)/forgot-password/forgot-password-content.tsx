"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordPageContent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center bg-panel px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink">{t.auth.forgotPasswordTitle}</h1>
          <p className="mt-2 text-sm text-body">{t.auth.forgotPasswordDesc}</p>
        </div>

        <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-body">
          <Link
            href="/login"
            className="font-semibold text-brand underline-offset-2 hover:text-brand-dark hover:underline"
          >
            {t.auth.backToSignIn}
          </Link>
        </p>
      </div>
    </div>
  );
}
