"use client";

import { Fragment } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const CHIP =
  "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition";
const IDLE = `${CHIP} bg-[#1A1D22] text-gray-300 hover:bg-[#242830] hover:text-white`;
const ACTIVE = `${CHIP} bg-white text-[#090A0C]`;
const DISABLED = "pointer-events-none opacity-40";

/** Page numbers worth showing: the edges plus the ones around the current page. */
function pageWindow(page: number, pageCount: number): number[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  return [...pages]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
}

export default function Pagination({ page, pageCount, onPageChange }: Props) {
  const goTo = (next: number) => {
    // TODO: write `next` into the search query (?page=…) and re-fetch.
    onPageChange(next);
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => goTo(page - 1)}
        className={`${IDLE} ${page === 1 ? DISABLED : ""}`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pageWindow(page, pageCount).map((p, index, pages) => (
        <Fragment key={p}>
          {index > 0 && p - pages[index - 1] > 1 && (
            <span aria-hidden="true" className="px-1 text-sm text-gray-500">
              …
            </span>
          )}

          <button
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => goTo(p)}
            className={p === page ? ACTIVE : IDLE}
          >
            {p}
          </button>
        </Fragment>
      ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => goTo(page + 1)}
        className={`${IDLE} ${page === pageCount ? DISABLED : ""}`}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
