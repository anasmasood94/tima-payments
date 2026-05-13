"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import type { Locale } from "@/lib/i18n/dictionaries";

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = locales.find((l) => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        <span className="text-base leading-none">{current.flag}</span>
        {current.label}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-md border border-line bg-white shadow-lg">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-panel ${
                locale === l.code ? "bg-brand/10 font-semibold text-brand" : "text-ink"
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
