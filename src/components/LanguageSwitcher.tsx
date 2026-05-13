"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/language-context";
import type { Locale } from "@/lib/i18n/dictionaries";

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "/flags/USA.png" },
  { code: "zh", label: "中文", flag: "/flags/CHN.png" },
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
        className="flex h-[45px] w-[120px] items-center justify-center gap-[5px] rounded-[10px] bg-[#14AA3C] text-[16px] font-normal leading-[1.5em] text-white transition [font-family:'Helvetica_W01',Arial,sans-serif] hover:bg-[#14AA3C]"
      >
        <Image src={current.flag} alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-full" />
        {current.label}
        <svg
          className={`h-[14px] w-[14px] transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 26 26"
        >
          <path d="M13 20.4 0 7.4l1.8-1.8L13 16.8 24.2 5.6 26 7.4z" />
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
              <Image src={l.flag} alt="" width={18} height={18} className="rounded-full" />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
