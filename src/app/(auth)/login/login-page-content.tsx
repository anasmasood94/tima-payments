"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";
import { LoginForm } from "./login-form";

export function LoginPageContent({
  next,
  hasError,
  passwordReset,
  emailVerified,
  verifyInvalid,
}: {
  next?: string;
  hasError: boolean;
  passwordReset?: boolean;
  emailVerified?: boolean;
  verifyInvalid?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center bg-panel px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink">{t.auth.welcomeBack}</h1>
          <p className="mt-2 text-sm text-body">{t.auth.signInDesc}</p>
        </div>

        <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
          {hasError ? (
            <p className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
              {t.auth.sessionExpired}
            </p>
          ) : null}
          {passwordReset ? (
            <p className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {t.auth.passwordResetSuccess}
            </p>
          ) : null}
          {emailVerified ? (
            <p className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {t.auth.emailVerifiedSuccess}
            </p>
          ) : null}
          {verifyInvalid ? (
            <p className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
              {t.auth.verifyLinkInvalid}
            </p>
          ) : null}
          <LoginForm next={next} />
        </div>

        <p className="mt-6 text-center text-sm text-body">
          {t.auth.needAccount}{" "}
          <Link
            href="/register"
            className="font-semibold text-brand underline-offset-2 hover:text-brand-dark hover:underline"
          >
            {t.auth.createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}
