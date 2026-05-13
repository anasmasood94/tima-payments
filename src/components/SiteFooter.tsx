"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/language-context";

export function SiteFooter({ loggedIn }: { loggedIn?: boolean }) {
  const { t } = useTranslation();

  return (
    <footer className={`mt-auto bg-white text-neutral-600 ${loggedIn ? "border-t border-line" : ""}`}>
      <div className="grid gap-10 px-20 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + Business Hours */}
        <div>
          <h3 className="text-xl font-bold text-ink">和 仓</h3>
          <h4 className="mt-1 text-base font-bold text-ink">B612 Tima Inc.</h4>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {t.footer.businessHours}
          </p>
          <p className="mt-1 text-sm">{t.footer.hours}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-ink">{t.footer.quickLinks}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/home" className="transition-colors hover:text-ink">{t.nav.home}</Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-ink">{t.nav.aboutUs}</Link>
            </li>
            <li>
              <Link href="/services" className="transition-colors hover:text-ink">{t.nav.services}</Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-ink">{t.nav.contact}</Link>
            </li>
          </ul>
        </div>

        {/* Office in China */}
        <div>
          <h4 className="text-sm font-bold text-ink">{t.footer.officeChina}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="mailto:FF@B612TimaInc.com" className="transition-colors hover:text-ink">
                FF@B612TimaInc.com
              </a>
            </li>
            <li>深宝茂大厦 · 813单元</li>
            <li>广东省深圳市龙华区</li>
            <li>民治街道民福北路67号</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-ink">{t.footer.contact}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>909-703-1305</li>
            <li>
              <a href="mailto:FF@B612TimaInc.com" className="transition-colors hover:text-ink">
                FF@B612TimaInc.com
              </a>
            </li>
            <li>2090 S. Baker Ave, Ontario, CA 91761</li>
            <li>深圳市深宝茂大厦813</li>
          </ul>
          {/* Social icons */}
          <div className="mt-4 flex items-center gap-3">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-ink" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-ink" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-ink" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-ink" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-200">
        <p className="px-20 py-5 text-center text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
