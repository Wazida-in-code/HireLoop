"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { Briefcase, ChevronDown, Plus } from "lucide-react";
import { formatSalary } from "@/lib/format";
import type { JobRecord } from "@/lib/types";
import {
  ApplicantsCount,
  CategoryTile,
  CompanyBlock,
  DeadlineBlock,
  JobActions,
  JobDetails,
  MetaLabel,
  SalaryText,
  StatusBadge,
  TypePill,
  getCategoryStyle,
} from "@/components/job-ui";

/* Repeated style atoms */
const PANEL = "rounded-xl border border-[#22252A] bg-[#0C0D10]";
const CELL = "px-5 py-4";
const TH = "px-5 py-4 font-medium";

/* ---------- Formatters (presentation logic for raw job fields) ---------- */

/** "YYYY-MM-DD" from <input type="date"> → local calendar date (avoids UTC off-by-one). */
function parseDeadline(value: string): Date | null {
  if (!value) return null;
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDeadline(value: string): string {
  const date = parseDeadline(value);
  if (!date) return value || "No deadline";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function isExpired(value: string): boolean {
  const date = parseDeadline(value);
  if (!date) return false;
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay < new Date();
}

/** Creation time: `createdAt` if present, else the timestamp embedded in the Mongo ObjectId. */
function createdAtOf(job: JobRecord): number | null {
  if (job.createdAt) {
    const time = new Date(job.createdAt).getTime();
    if (!Number.isNaN(time)) return time;
  }

  const hex = job._id?.slice(0, 8);
  if (hex && /^[0-9a-f]{8}$/i.test(hex)) {
    return parseInt(hex, 16) * 1000;
  }
  return null;
}

function postedAgo(job: JobRecord): string {
  const then = createdAtOf(job);
  if (then === null) return "\u00A0"; // keep the sub-line height consistent between rows

  const diff = Date.now() - then;
  if (diff < 0) return "\u00A0";

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Posted just now";
  if (minutes < 60) return `Posted ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Posted ${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `Posted ${days}d ago`;

  const months = Math.floor(days / 30);
  return `Posted ${months}mo ago`;
}

/* ---------- Table ---------- */

type Props = {
  jobs: JobRecord[];
};

export default function JobsTable({ jobs }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  if (jobs.length === 0) {
    return (
      <div className={`mx-auto max-w-md ${PANEL} px-6 py-12 text-center sm:py-16`}>
        <Briefcase className="mx-auto h-10 w-10 text-gray-600" />

        <h2 className="mt-4 text-lg font-semibold text-white">No job posts yet</h2>

        <p className="mt-1 text-sm text-gray-500">
          Create your first job post to start receiving applications.
        </p>

        <Link
          href="/dashboard/recruiter/jobs"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Job Post
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ---------- Small screens (< md): stacked cards ---------- */}
      <ul className="space-y-3 md:hidden">
        {jobs.map((job) => {
          const expired = isExpired(job.deadline);
          const expanded = expandedId === job._id;
          const deptClass = getCategoryStyle(job.category).text;

          return (
            <li key={job._id} className={`overflow-hidden ${PANEL}`}>
              {/* Tappable header */}
              <button
                type="button"
                onClick={() => toggleDetails(job._id)}
                aria-expanded={expanded}
                className="flex w-full cursor-pointer items-start gap-3 p-4 text-left"
              >
                <CategoryTile category={job.category} />

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-white">
                    {job.title}
                  </span>
                  <span className={`block text-xs ${deptClass}`}>
                    {job.category || "Uncategorized"}
                  </span>
                  <span className="mt-1.5 block">
                    <StatusBadge expired={expired} />
                  </span>
                </span>

                <ChevronDown
                  className={`mt-1 h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Details (tap header or kebab → View details) */}
              {expanded && (
                <div className="border-t border-[#1A1D22] bg-[#121316]/40 p-4">
                  <JobDetails job={job} />
                </div>
              )}

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#1A1D22] px-4 py-3">
                <div className="col-span-2">
                  <CompanyBlock job={job} />
                </div>

                <div className="min-w-0">
                  <MetaLabel>Type</MetaLabel>
                  <TypePill type={job.jobType} className="mt-1" />
                </div>

                <div className="min-w-0">
                  <MetaLabel>Compensation</MetaLabel>
                  <SalaryText value={formatSalary(job)} className="mt-1 text-sm" />
                </div>

                <div className="min-w-0">
                  <MetaLabel>Deadline</MetaLabel>
                  <DeadlineBlock
                    date={formatDeadline(job.deadline)}
                    sub={expired ? "Closed" : postedAgo(job)}
                    className="mt-1"
                  />
                </div>

                <div className="min-w-0">
                  <MetaLabel>Applicants</MetaLabel>
                  <ApplicantsCount count={job.applicants} className="mt-1" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end border-t border-[#1A1D22] p-3">
                <JobActions
                  job={job}
                  expanded={expanded}
                  onToggle={() => toggleDetails(job._id)}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {/* ---------- md and up: full table ---------- */}
      <div className={`hidden overflow-x-auto md:block ${PANEL}`}>
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#22252A] text-[11px] tracking-wider text-gray-500 uppercase">
              <th className={TH}>Job Title &amp; Dept</th>
              <th className={TH}>Company &amp; Location</th>
              <th className={TH}>Type</th>
              <th className={TH}>Compensation</th>
              <th className={TH}>Applicants</th>
              <th className={TH}>Status</th>
              <th className={TH}>Deadline</th>
              <th className={`${TH} text-right`}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => {
              const expired = isExpired(job.deadline);
              const expanded = expandedId === job._id;
              const deptClass = getCategoryStyle(job.category).text;

              return (
                <Fragment key={job._id}>
                  <tr
                    onClick={() => toggleDetails(job._id)}
                    className={`cursor-pointer border-b border-[#1A1D22] transition-colors hover:bg-[#121316] ${
                      expanded ? "bg-[#121316]" : ""
                    }`}
                  >
                    {/* Job Title & Dept */}
                    <td className={CELL}>
                      <div className="flex items-center gap-3">
                        <CategoryTile category={job.category} />

                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {job.title}
                          </p>
                          <p className={`text-xs ${deptClass}`}>
                            {job.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company & Location */}
                    <td className={CELL}>
                      <CompanyBlock job={job} />
                    </td>

                    {/* Type */}
                    <td className={CELL}>
                      <TypePill type={job.jobType} />
                    </td>

                    {/* Compensation */}
                    <td className={`${CELL} whitespace-nowrap`}>
                      <SalaryText value={formatSalary(job)} />
                    </td>

                    {/* Applicants */}
                    <td className={`${CELL} whitespace-nowrap`}>
                      <ApplicantsCount count={job.applicants} />
                    </td>

                    {/* Status */}
                    <td className={CELL}>
                      <StatusBadge expired={expired} />
                    </td>

                    {/* Deadline */}
                    <td className={`${CELL} whitespace-nowrap`}>
                      <DeadlineBlock
                        date={formatDeadline(job.deadline)}
                        sub={expired ? "Closed" : postedAgo(job)}
                      />
                    </td>

                    {/* Actions */}
                    <td className={CELL} onClick={(event) => event.stopPropagation()}>
                      <JobActions
                        job={job}
                        expanded={expanded}
                        onToggle={() => toggleDetails(job._id)}
                      />
                    </td>
                  </tr>

                  {/* Expandable detail row — description / responsibilities / requirements */}
                  {expanded && (
                    <tr className="border-b border-[#1A1D22] bg-[#121316]/40">
                      <td colSpan={8} className="px-5 py-5">
                        <JobDetails job={job} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
