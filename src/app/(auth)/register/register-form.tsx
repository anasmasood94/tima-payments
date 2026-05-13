"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { useTranslation } from "@/lib/i18n/language-context";

const field =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15";

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, null as { error?: string } | null);
  const { t } = useTranslation();

  return (
    <form action={action} className="space-y-5">
      {state?.error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div>
        <label htmlFor="reg-name" className="block text-base font-bold leading-tight text-ink">
          {t.auth.fullName}
        </label>
        <input id="reg-name" name="name" required placeholder={t.auth.namePlaceholder} className={field} />
      </div>

      <div>
        <label htmlFor="reg-company" className="block text-base font-bold leading-tight text-ink">
          {t.auth.company} <span className="font-normal text-muted">{t.auth.optional}</span>
        </label>
        <input id="reg-company" name="companyName" placeholder={t.auth.companyPlaceholder} className={field} />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-base font-bold leading-tight text-ink">
          {t.auth.workEmail}
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.auth.emailPlaceholder}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-base font-bold leading-tight text-ink">
          {t.auth.password} <span className="font-normal text-muted">{t.auth.passwordMin}</span>
        </label>
        <input
          id="reg-password"
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
        {t.auth.createBtn}
      </button>
    </form>
  );
}
