import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/actions/auth";

export async function SiteNav() {
  const session = await getSession();

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/catalog" className="font-display text-xl font-bold tracking-tight text-brick">
          Ti<span className="text-ink">ma</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-body">
          <Link href="/catalog" className="font-medium text-body hover:text-ink">
            Catalog
          </Link>
          {session ? (
            <>
              {session.role === "ADMIN" ? (
                <Link href="/admin" className="font-medium text-body hover:text-ink">
                  Admin
                </Link>
              ) : null}
              <Link href="/portal" className="font-medium text-body hover:text-ink">
                My account
              </Link>
              <span className="text-muted/70">{session.email}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-ark border border-line bg-white px-3 py-1.5 text-xs font-medium text-body shadow-ark hover:bg-panel"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-medium text-body hover:text-ink">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-ark bg-brick px-3 py-1.5 text-xs font-medium text-white shadow-ark hover:bg-brick/90"
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
