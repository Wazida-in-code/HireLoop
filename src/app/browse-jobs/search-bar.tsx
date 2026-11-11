"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Props = {
  /** Query currently in the URL, so the input starts out in sync with the results. */
  initialQuery?: string;
};

export default function SearchBar({ initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: write `query` into the URL search params (?q=…) and re-fetch.
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-xl border border-[#22252A] bg-[#121316] py-2 pr-2 pl-4"
    >
      <Search className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />

      <label htmlFor="job-search" className="sr-only">
        Search jobs
      </label>
      <input
        id="job-search"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by job title, keywords..."
        className="min-w-0 flex-1 bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-500"
      />

      <button
        type="submit"
        className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#090A0C] transition hover:bg-gray-200"
      >
        Search Jobs
      </button>
    </form>
  );
}
