"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

const field =
  "mt-2 w-full rounded-ark border border-line bg-white px-4 py-2.5 text-base text-ink shadow-ark outline-none transition placeholder:text-muted focus:border-brick focus:ring-2 focus:ring-brick/15";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(loginAction, null as { error?: string } | null);

  return (
    <form action={action} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state?.error ? (
        <p className="rounded-ark border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div>
        <label htmlFor="login-email" className="block text-base font-bold leading-tight text-ink">
          Email
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
          Password
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
        className="w-full rounded-ark bg-brick py-3 text-base font-semibold text-white shadow-ark transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brick hover:shadow-[0_0.5rem_1.25rem_rgba(192,70,87,0.28)] focus:outline-none focus:ring-2 focus:ring-brick focus:ring-offset-2 active:translate-y-0"
      >
        Sign in
      </button>
    </form>
  );
}
