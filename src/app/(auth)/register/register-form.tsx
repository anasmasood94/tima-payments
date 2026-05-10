"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";

const field =
  "mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100";

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, null as { error?: string } | null);

  return (
    <form action={action} className="space-y-5">
      {state?.error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-zinc-700">
          Full name
        </label>
        <input id="reg-name" name="name" required placeholder="Jane Smith" className={field} />
      </div>

      <div>
        <label htmlFor="reg-company" className="block text-sm font-medium text-zinc-700">
          Company <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <input id="reg-company" name="companyName" placeholder="Acme Logistics LLC" className={field} />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-zinc-700">
          Work email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-zinc-700">
          Password <span className="font-normal text-zinc-400">(min 8 characters)</span>
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
        className="w-full rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
      >
        Create account
      </button>
    </form>
  );
}
