"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";

/**
 * Header actions: save-the-job toggle + Apply Now.
 * Applying needs an account for now, so the button routes to sign-in.
 */
export default function JobActions({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => setSaved((value) => !value)}
        aria-pressed={saved}
        aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
        className="rounded-lg p-2.5 text-gray-400 transition hover:bg-[#1E2126] hover:text-white"
      >
        <Bookmark
          className={`h-5 w-5 ${saved ? "fill-current text-amber-400" : ""}`}
          aria-hidden="true"
        />
      </button>

      <Link
        href="/sign-in"
        className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#090A0C] transition hover:bg-gray-200"
      >
        Apply Now
      </Link>
    </div>
  );
}
