import type { ReactNode } from "react";
import { Bookmark, Briefcase, DollarSign } from "lucide-react";
import { CategoryTile } from "@/components/job-ui";
import { formatSalary, hasSalary } from "@/lib/format";
import type { JobRecord } from "@/lib/types";

/** "San Francisco, CA (Remote)" — the location line under the title. */
function locationLabel(job: JobRecord): string {
  if (!job.location) return job.isRemote ? "Remote" : "Location not specified";
  return job.isRemote ? `${job.location} (Remote)` : job.location;
}

function Pill({
  icon: Icon,
  children,
}: {
  icon: typeof Briefcase;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E2126] px-3 py-1.5 text-xs font-medium text-gray-300">
      <Icon className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function JobCard({ job }: { job: JobRecord }) {
  return (
    <article className="flex items-start gap-4 rounded-xl border border-[#22252A] bg-[#121316] p-4 transition-colors hover:border-[#2E333B]">
      <CategoryTile category={job.category} />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-white">
          {job.title}
        </h3>

        <p className="mt-1 truncate text-sm text-gray-400">
          {job.company}
          <span className="mx-1.5 text-gray-600" aria-hidden="true">
            •
          </span>
          {locationLabel(job)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {hasSalary(job) && <Pill icon={DollarSign}>{formatSalary(job)}</Pill>}
          <Pill icon={Briefcase}>{job.jobType}</Pill>
        </div>
      </div>

      {/* TODO: save the job for later (bookmark). */}
      <button
        type="button"
        aria-label={`Save ${job.title}`}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-[#1E2126] hover:text-white"
      >
        <Bookmark className="h-4 w-4" aria-hidden="true" />
      </button>
    </article>
  );
}
