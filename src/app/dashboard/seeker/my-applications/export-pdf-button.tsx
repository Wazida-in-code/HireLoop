"use client";

import { Download } from "lucide-react";

/** Prints the page, which the browser saves as a PDF. */
export default function ExportPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#090A0C] transition hover:bg-gray-200"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Export PDF
    </button>
  );
}
