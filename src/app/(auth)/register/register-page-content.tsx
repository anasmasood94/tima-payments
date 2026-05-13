"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";
import { RegisterForm } from "./register-form";

export function RegisterPageContent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center bg-panel px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink">{t.auth.createAccountTitle}</h1>
          <p className="mt-2 text-sm text-body">{t.auth.createAccountDesc}</p>
        </div>

        <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-body">
          {t.auth.alreadyHaveAccount}{" "}
          <Link
            href="/login"
            className="font-semibold text-brand underline-offset-2 hover:text-brand-dark hover:underline"
          >
            {t.auth.signInLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
