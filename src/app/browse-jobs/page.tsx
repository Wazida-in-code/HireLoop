import type { Metadata } from "next";
import { getJobs } from "@/lib/api/jobs";
import BrowseJobs from "./browse-jobs";

export const metadata: Metadata = {
  title: "Browse Jobs — HireLoop",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Subtle stars scattered over the striped background.
const stars = [
  { left: "6%", top: "8%", size: 2, className: "bg-white/30" },
  { left: "14%", top: "22%", size: 2, className: "bg-white/20" },
  { left: "9%", top: "44%", size: 3, className: "bg-[#8b9cff]/40" },
  { left: "22%", top: "60%", size: 2, className: "bg-white/25" },
  { left: "30%", top: "14%", size: 2, className: "bg-white/20" },
  { left: "68%", top: "10%", size: 2, className: "bg-white/20" },
  { left: "84%", top: "26%", size: 2, className: "bg-white/30" },
  { left: "92%", top: "48%", size: 3, className: "bg-[#8b9cff]/40" },
  { left: "76%", top: "66%", size: 2, className: "bg-white/20" },
  { left: "88%", top: "78%", size: 2, className: "bg-white/25" },
];

export default async function BrowseJobsPage({ searchParams }: Props) {
  const search = await searchParams
    const urlSearch = new URLSearchParams(search as Record<string, string>);
    const query = urlSearch.toString()
    const jobs = await getJobs(query)
    const initialQuery = typeof search.q === "string" ? search.q : "";

  return (
    <div className="striped-dark relative min-h-screen overflow-hidden text-white">
      {/* Decorative stars — same treatment as the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {stars.map(({ left, top, size, className }) => (
          <span
            key={`${left}-${top}`}
            className={`absolute rounded-full ${className}`}
            style={{ left, top, width: size, height: size }}
          />
        ))}
        {/* Soft purple glow, bottom-right. */}
        <span className="absolute -right-24 -bottom-32 h-72 w-72 rounded-full bg-[#5b50e6]/25 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <BrowseJobs jobs={jobs} initialQuery={initialQuery} />
      </div>
    </div>
  );
}
