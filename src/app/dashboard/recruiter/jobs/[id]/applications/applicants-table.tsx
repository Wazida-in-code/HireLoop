"use client";

import { Fragment, useState } from "react";
import { Search, Users, X } from "lucide-react";
import { MetaLabel } from "@/components/job-ui";
import type { ApplicationRecord, ApplicationStatus } from "@/lib/types";

/** Badge colours per application status (shared with the seeker table). */
const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-[#1E2126] text-gray-300",
  Review: "bg-amber-500/15 text-amber-400",
  Interview: "bg-indigo-500/15 text-indigo-300",
  Shortlisted: "bg-blue-500/15 text-blue-300",
  Rejected: "bg-red-500/15 text-red-400",
  Offered: "bg-emerald-500/15 text-emerald-400",
};

/** Statuses offered in the filter dropdown. */
const STATUS_OPTIONS = ["All", "Applied", "Shortlisted", "Interview", "Rejected"];

const PANEL = "overflow-hidden rounded-xl border border-[#22252A] bg-[#121316]";
const CELL = "px-5 py-4 align-top";
const TH = "px-5 py-4 font-medium";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

/** "Nov 12, 2026" from an ISO timestamp. */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

type Props = {
  /** Applications for the selected job (from GET /applications?jobId=...). */
  applications: ApplicationRecord[];
};

/** Searchable, filterable applicants table with expandable detail rows. */
export default function ApplicantsTable({ applications }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  // Applications whose email matches the search box.
  const trimmed = query.trim().toLowerCase();
  const filtered = applications.filter((application) => {
    const matchesQuery = application.email.toLowerCase().includes(trimmed);
    const matchesStatus = status === "All" || application.status === status;
    return matchesQuery && matchesStatus;
  });

  const clearFilters = () => {
    setQuery("");
    setStatus("All");
  };

  /* ---------- Empty state: this job has no applications at all ---------- */

  if (applications.length === 0) {
    return (
      <div className={`${PANEL} px-6 py-16 text-center`}>
        <Users className="mx-auto h-10 w-10 text-gray-600" />
        <h2 className="mt-4 text-base font-semibold text-white">
          No applicants yet
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          When someone applies to this job, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={PANEL}>
      {/* Toolbar: search + status filter */}
      <div className="flex flex-col gap-3 border-b border-[#22252A] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by email..."
            className="w-full rounded-lg border border-[#22252A] bg-[#121316] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-[#22252A] bg-[#121316] px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 [&>option]:bg-[#121316]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All statuses" : option}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        /* No rows match the current filters */
        <div className="px-6 py-16 text-center">
          <h2 className="text-base font-semibold text-white">No matches</h2>
          <p className="mt-1 text-sm text-gray-500">
            Try a different search or status filter.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#22252A] bg-[#1E2126] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#22252A] text-xs text-gray-500">
                  <th className={TH}>Applicant</th>
                  <th className={TH}>Applied</th>
                  <th className={TH}>Status</th>
                  <th className={`${TH} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((application) => (
                  <Fragment key={application._id}>
                    <tr className="border-b border-[#22252A] transition-colors hover:bg-[#16181D]">
                      <td className={CELL}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A1D22] text-sm font-semibold text-indigo-400">
                            {application.email.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium break-all text-white">
                            {application.email}
                          </span>
                        </div>
                      </td>
                      <td className={`${CELL} whitespace-nowrap text-gray-400`}>
                        {formatDate(application.appliedAt)}
                      </td>
                      <td className={`${CELL} whitespace-nowrap`}>
                        <StatusBadge status={application.status} />
                      </td>
                      <td className={`${CELL} text-right`}>
                        <button
                          onClick={() =>
                            setOpenId(
                              openId === application._id ? null : application._id,
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#22252A] bg-[#1E2126] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>

                    {/* Expanded details panel */}
                    {openId === application._id && (
                      <tr className="border-b border-[#22252A] bg-[#16181D]">
                        <td colSpan={4} className="px-5 py-5">
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <MetaLabel>Email</MetaLabel>
                              <p className="mt-1 break-all text-sm text-gray-200">
                                {application.email}
                              </p>
                            </div>
                            <div>
                              <MetaLabel>Job Location</MetaLabel>
                              <p className="mt-1 text-sm text-gray-200">
                                {application.location || "—"}
                              </p>
                            </div>
                            <div>
                              <MetaLabel>Applied On</MetaLabel>
                              <p className="mt-1 text-sm text-gray-200">
                                {formatDate(application.appliedAt)}
                              </p>
                            </div>
                            <div>
                              <MetaLabel>Status</MetaLabel>
                              <span className="mt-1 inline-block">
                                <StatusBadge status={application.status} />
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Result count */}
          <div className="border-t border-[#22252A] px-5 py-3 text-xs text-gray-500">
            Showing {filtered.length} of {applications.length} applicant
            {applications.length === 1 ? "" : "s"}
          </div>
        </>
      )}
    </div>
  );
}
