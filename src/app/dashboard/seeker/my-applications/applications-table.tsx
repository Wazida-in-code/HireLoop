import Link from "next/link";
import type { ReactNode } from "react";
import { ClipboardList } from "lucide-react";
import { CategoryTile } from "@/components/job-ui";
import type { ApplicationRecord, ApplicationStatus } from "@/lib/types";

type Props = {
  /** Rows for the current page (already tab-filtered and sliced). */
  rows: ApplicationRecord[];
  page: number;
  pageCount: number;
  pageSize: number;
  /** How many rows the current tab has in total. */
  totalVisible: number;
  /** Whether any application exists at all (drives the empty-state copy). */
  hasAny: boolean;
  isArchived: boolean;
};

/** Badge colours per application status (from the Figma design). */
const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-[#1E2126] text-gray-300",
  Review: "bg-amber-500/15 text-amber-400",
  Interview: "bg-indigo-500/15 text-indigo-300",
  Shortlisted: "bg-blue-500/15 text-blue-300",
  Rejected: "bg-red-500/15 text-red-400",
  Offered: "bg-emerald-500/15 text-emerald-400",
};

/** "2 hours ago" / "3 weeks ago" from an ISO timestamp. */
function timeAgo(iso?: string): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const minutes = Math.floor((Date.now() - then) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  if (days < 365) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/** "Full-time • Remote" — the second line under the job title. */
function workMode(job: ApplicationRecord): string {
  return `${job.jobType || "Full-time"} • ${job.isRemote ? "Remote" : "On-site"}`;
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] ?? statusStyles.Applied
      }`}
    >
      {status}
    </span>
  );
}

function PageLink({
  href,
  children,
  disabled,
}: {
  href: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  const className =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-[#22252A] text-sm text-gray-400 transition hover:border-[#2E333B] hover:text-white";

  if (disabled) {
    return (
      <span className={`${className} cursor-not-allowed opacity-40`} aria-hidden="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function ApplicationsTable({
  rows,
  page,
  pageCount,
  pageSize,
  totalVisible,
  hasAny,
  isArchived,
}: Props) {
  const from = totalVisible === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalVisible);
  const tabQuery = isArchived ? "?tab=archived&" : "?";

  return (
    <section className="overflow-hidden rounded-xl border border-[#22252A] bg-[#121316]">
      {rows.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-gray-600" />
          <h2 className="mt-4 text-lg font-semibold">
            {hasAny
              ? isArchived
                ? "No archived applications"
                : "No active applications"
              : "No applications yet"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {hasAny
              ? isArchived
                ? "Applications you archive will show up here."
                : "All of your applications are archived."
              : "Apply to a job and it will appear here right away."}
          </p>
          {!hasAny && (
            <Link
              href="/browse-jobs"
              className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#090A0C] transition hover:bg-gray-200"
            >
              Browse Jobs
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#22252A] text-xs text-gray-500">
                <th className="px-5 py-4 font-medium">Job Title</th>
                <th className="px-5 py-4 font-medium">Company</th>
                <th className="px-5 py-4 font-medium">Applied</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-[#22252A] last:border-0 transition-colors hover:bg-[#16181D]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CategoryTile category={job.category} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {job.jobTitle}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {workMode(job)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-300">{job.companyName}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {timeAgo(job.appliedAt ?? job.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/browse-jobs/${job.jobId}`}
                      className="text-sm text-gray-400 transition hover:text-white"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer: range + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-sm text-gray-500">
          Showing {from}–{to} of {totalVisible} application
          {totalVisible === 1 ? "" : "s"}
        </p>

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="flex items-center gap-2">
            <PageLink href={`${tabQuery}page=${page - 1}`} disabled={page <= 1}>
              ‹
            </PageLink>

            {Array.from({ length: pageCount }, (_, index) => index + 1).map((n) => (
              <Link
                key={n}
                href={`${tabQuery}page=${n}`}
                aria-current={n === page ? "page" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${
                  n === page
                    ? "border-white bg-white font-semibold text-[#090A0C]"
                    : "border-[#22252A] text-gray-400 hover:border-[#2E333B] hover:text-white"
                }`}
              >
                {n}
              </Link>
            ))}

            <PageLink href={`${tabQuery}page=${page + 1}`} disabled={page >= pageCount}>
              ›
            </PageLink>
          </nav>
        )}
      </div>
    </section>
  );
}