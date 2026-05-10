import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-panel px-4 py-16 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.42),rgba(0,0,0,0.28)),linear-gradient(160deg,#6b6b6b_0%,#a3a3a3_45%,#d4d4d4_100%)]"
        aria-hidden
      />
      <div className="relative z-[1] flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-[32rem]">
          <div className="mb-10 text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            <p className="font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-brick">
              Ti<span className="text-white">ma</span>
            </p>
            <h1 className="mt-6 font-display text-[1.625rem] font-bold leading-tight text-white">
              Create customer account
            </h1>
            <p className="mt-2 text-center text-base font-medium leading-snug text-white/95">
              For warehouse service orders and payments. Admin accounts are provisioned separately.
            </p>
          </div>

          <div className="relative rounded-ark-outer border border-line bg-panel p-5 shadow-ark-card sm:p-6">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-8 sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-[22.5rem] w-[22.5rem] rounded-full bg-decorative/80" />
              <div className="pointer-events-none absolute -bottom-32 -left-28 h-[22.5rem] w-[22.5rem] rounded-full bg-decorative/80" />

              <div className="relative z-[1]">
                <RegisterForm />
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-base font-medium text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-sky-300 no-underline underline-offset-2 hover:text-white hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
