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

function LoginAvatarIcon({ className = "h-[26px] w-[26px]" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 50 50" aria-hidden="true">
      <path d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.997.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0" />
    </svg>
  );
}

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
              className="flex h-10 w-[82px] items-center justify-center gap-[7px] text-[16px] font-normal leading-[1.5em] text-[#545454] transition-opacity [font-family:'Helvetica_W01',Arial,sans-serif] hover:opacity-70"
            >
              <LoginAvatarIcon />
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
                className="flex h-10 w-[82px] items-center justify-center gap-[7px] text-[16px] font-normal leading-[1.5em] text-[#545454] transition-opacity [font-family:'Helvetica_W01',Arial,sans-serif] hover:opacity-70"
              >
                <LoginAvatarIcon />
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
