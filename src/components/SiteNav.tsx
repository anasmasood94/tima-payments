import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/actions/auth";

export async function SiteNav() {
  const session = await getSession();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/catalog" className="text-lg font-semibold tracking-tight text-zinc-900">
          Tima
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
          <Link href="/catalog" className="font-medium text-zinc-700 hover:text-zinc-900">
            Catalog
          </Link>
          {session ? (
            <>
              {session.role === "ADMIN" ? (
                <Link href="/admin" className="font-medium text-zinc-700 hover:text-zinc-900">
                  Admin
                </Link>
              ) : null}
              <Link href="/portal" className="font-medium text-zinc-700 hover:text-zinc-900">
                Portal
              </Link>
              <span className="text-zinc-400">{session.email}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-medium text-zinc-700 hover:text-zinc-900">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-zinc-800"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
