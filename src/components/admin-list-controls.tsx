"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n/language-context";

const PAGE_SIZE = 10;

export function useSearchPagination<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => searchFn(item, q));
  }, [items, query, searchFn]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safeCurrentPage = Math.min(page, totalPages || 1);

  const paginated = useMemo(
    () => filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE),
    [filtered, safeCurrentPage],
  );

  function handleSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  return {
    query,
    setQuery: handleSearch,
    page: safeCurrentPage,
    setPage,
    totalPages,
    totalFiltered: filtered.length,
    paginated,
    showPagination: filtered.length > PAGE_SIZE,
  };
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx={11} cy={11} r={8} />
        <path strokeLinecap="round" d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const { t } = useTranslation();

  const pages = useMemo(() => {
    const result: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        result.push(i);
      } else if (result[result.length - 1] !== "…") {
        result.push("…");
      }
    }
    return result;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md px-2.5 py-1.5 text-sm text-body transition-colors hover:bg-panel disabled:opacity-40"
      >
        ‹ {t.pagination.prev}
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[2rem] rounded-md px-2 py-1.5 text-sm transition-colors ${
              p === page
                ? "bg-brand font-medium text-white"
                : "text-body hover:bg-panel"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md px-2.5 py-1.5 text-sm text-body transition-colors hover:bg-panel disabled:opacity-40"
      >
        {t.pagination.next} ›
      </button>
    </div>
  );
}
