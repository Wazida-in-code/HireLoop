import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import JobDetails from "./job-details";

export const metadata: Metadata = {
  title: "Job Details — HireLoop",
};

type Props = {
  params: Promise<{ id: string }>;
};

// Subtle stars scattered over the striped background — same as /browse-jobs.
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

/**
 * The job fetch needs `params`, so it is kept inside a Suspense boundary:
 * Next.js can still prerender the static shell (nav + skeleton) and streams
 * the real details in at request time.
 */
export default function JobDetailsPage({ params }: Props) {
  return (
    <div className="striped-dark relative min-h-screen overflow-hidden text-white">
      {/* Decorative stars + glow — static markup only, so the shell still prerenders. */}
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

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={<JobDetailsSkeleton />}>
          <JobDetails params={params} />
        </Suspense>
      </main>
    </div>
  );
}

function JobDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      <div className="rounded-xl border border-[#22252A] bg-[#121316] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-xl bg-[#1A1D22]" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-6 w-64 max-w-full bg-[#1A1D22]" />
            <Skeleton className="h-4 w-40 bg-[#1A1D22]" />
          </div>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl bg-[#121316]" />
            ))}
          </div>
          <Skeleton className="h-40 rounded-xl bg-[#121316]" />
          <Skeleton className="h-56 rounded-xl bg-[#121316]" />
          <Skeleton className="h-56 rounded-xl bg-[#121316]" />
        </div>
        <Skeleton className="h-80 rounded-xl bg-[#121316]" />
      </div>
    </div>
  );
}
