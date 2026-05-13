import Link from "next/link";
import { CATALOG_PAGE_SIZE } from "./catalog-constants";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
};

export function CatalogPagination({ page, totalPages, totalItems }: Props) {
  if (totalPages <= 1) {
    return (
      <p className="text-center text-sm text-muted">
        Showing all {totalItems} {totalItems === 1 ? "item" : "items"}
      </p>
    );
  }

  const itemStart = (page - 1) * CATALOG_PAGE_SIZE + 1;
  const itemEnd = Math.min(page * CATALOG_PAGE_SIZE, totalItems);

  return (
    <nav
      className="flex flex-col items-center gap-3 border-t border-line/60 pt-6 sm:flex-row sm:justify-between"
      aria-label="Catalog pagination"
    >
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-ink">{itemStart}</span>–
        <span className="font-medium text-ink">{itemEnd}</span> of{" "}
        <span className="font-medium text-ink">{totalItems}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? (
          <Link
            href={`/catalog?page=${page - 1}#shop`}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium text-body shadow-sm hover:bg-panel"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-md border border-transparent px-3 py-1.5 text-sm font-medium text-muted/50">
            Previous
          </span>
        )}
        <span className="px-2 text-sm tabular-nums text-body">
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <Link
            href={`/catalog?page=${page + 1}#shop`}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium text-body shadow-sm hover:bg-panel"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-md border border-transparent px-3 py-1.5 text-sm font-medium text-muted/50">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
