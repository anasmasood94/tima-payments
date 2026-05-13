"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { useTranslation } from "@/lib/i18n/language-context";

const field =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(loginAction, null as { error?: string } | null);
  const { t } = useTranslation();

  return (
    <form action={action} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state?.error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div>
        <label htmlFor="login-email" className="block text-base font-bold leading-tight text-ink">
          {t.auth.email}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-base font-bold leading-tight text-ink">
          {t.auth.password}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          className={field}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
      >
        {t.auth.signIn}
      </button>
    </form>
  );
}
