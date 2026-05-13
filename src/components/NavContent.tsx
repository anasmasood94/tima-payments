"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";
import { logoutAction } from "@/actions/auth";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  session: { role: string } | null;
};

export function NavContent({ session }: Props) {
  const { t } = useTranslation();

  return (
    <header className="bg-white">
      <div className="flex items-center px-20 py-5">
        <Link href="/home" className="shrink-0 text-2xl font-bold tracking-tight text-ink">
          B612 Tima Inc.
        </Link>

        <nav className="ml-10 flex flex-1 items-center gap-10 text-[15px]">
          <Link href="/home" className="text-muted transition-colors hover:text-ink">
            {t.nav.home}
          </Link>
          <Link href="/about" className="text-muted transition-colors hover:text-ink">
            {t.nav.aboutUs}
          </Link>
          <Link href="/home#services" className="text-muted transition-colors hover:text-ink">
            {t.nav.services}
          </Link>
          <Link href="/home#contact" className="text-muted transition-colors hover:text-ink">
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          {session ? (
            <>
              {session.role === "ADMIN" ? (
                <Link href="/admin" className="text-[15px] text-muted transition-colors hover:text-ink">
                  {t.nav.admin}
                </Link>
              ) : null}
              <Link href="/portal" className="text-[15px] text-muted transition-colors hover:text-ink">
                {t.nav.myAccount}
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {t.nav.logOut}
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-[15px] text-muted transition-colors hover:text-ink"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              {t.nav.logIn}
            </Link>
          )}

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
