"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import { logoutAction } from "@/actions/auth";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  session: { role: string } | null;
};

const navLinks = [
  { href: "/home", key: "home" as const },
  { href: "/about", key: "aboutUs" as const },
  { href: "/services", key: "services" as const },
  { href: "/contact", key: "contact" as const },
];

const adminSubLinks = [
  { href: "/admin", key: "adminDashboard" as const },
  { href: "/admin/orders", key: "adminOrders" as const },
  { href: "/admin/products", key: "adminProducts" as const },
  { href: "/admin/invoices", key: "adminInvoices" as const },
  { href: "/admin/customers", key: "adminCustomers" as const },
  { href: "/admin/payments", key: "adminPayments" as const },
];

export function NavContent({ session }: Props) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = !session
    ? navLinks
    : session.role === "ADMIN"
      ? adminSubLinks
      : [
          { href: "/catalog", key: "services" as const },
          { href: "/portal", key: "myAccount" as const },
        ];

  return (
    <header className={`bg-white ${session ? "border-b border-line shadow-sm" : ""}`}>
      <div className="flex items-center justify-between px-4 py-4 sm:px-10 lg:px-20 lg:py-5">
        <Link href="/home" className="shrink-0 text-xl font-bold tracking-tight text-ink sm:text-2xl">
          B612 Tima Inc.
        </Link>

        {/* Desktop nav */}
        <nav className="ml-10 hidden flex-1 items-center gap-6 text-[15px] lg:flex lg:gap-10">
          {links.map((link) => {
            const isActive =
              link.href === "/home"
                ? pathname === "/home"
                : link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`transition-colors hover:text-ink ${isActive ? "text-muted" : "text-ink font-medium"}`}
              >
                {t.nav[link.key]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {session ? (
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

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-line bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 py-2">
            {links.map((link) => {
              const isActive =
                link.href === "/home"
                  ? pathname === "/home"
                  : link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-brand/5 text-brand" : "text-ink hover:bg-panel"
                  }`}
                >
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center justify-between border-t border-line pt-3">
            {session ? (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {t.nav.logOut}
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
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
      )}
    </header>
  );
}
