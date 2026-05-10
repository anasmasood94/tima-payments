import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-white shadow-md">
              T
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Create customer account</h1>
            <p className="mt-2 text-sm text-zinc-500">
              For warehouse service orders and payments. Admin accounts are provisioned separately.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50 sm:p-10">
            <RegisterForm />
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
