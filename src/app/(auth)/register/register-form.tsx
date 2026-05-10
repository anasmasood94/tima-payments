"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";

const field =
  "mt-2 w-full rounded-ark border border-line bg-white px-4 py-2.5 text-base text-ink shadow-ark outline-none transition placeholder:text-muted focus:border-brick focus:ring-2 focus:ring-brick/15";

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, null as { error?: string } | null);

  return (
    <form action={action} className="space-y-5">
      {state?.error ? (
        <p className="rounded-ark border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>
      ) : null}

      <div>
        <label htmlFor="reg-name" className="block text-base font-bold leading-tight text-ink">
          Full name
        </label>
        <input id="reg-name" name="name" required placeholder="Jane Smith" className={field} />
      </div>

      <div>
        <label htmlFor="reg-company" className="block text-base font-bold leading-tight text-ink">
          Company <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="reg-company" name="companyName" placeholder="Acme Logistics LLC" className={field} />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-base font-bold leading-tight text-ink">
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
        <label htmlFor="reg-password" className="block text-base font-bold leading-tight text-ink">
          Password <span className="font-normal text-muted">(min 8 characters)</span>
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
        className="w-full rounded-ark bg-brick py-3 text-base font-semibold text-white shadow-ark transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brick hover:shadow-[0_0.5rem_1.25rem_rgba(192,70,87,0.28)] focus:outline-none focus:ring-2 focus:ring-brick focus:ring-offset-2 active:translate-y-0"
      >
        Create account
      </button>
    </form>
  );
}
