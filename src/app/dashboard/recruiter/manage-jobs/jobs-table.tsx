"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ChevronDown,
  Cloud,
  Code,
  EllipsisVertical,
  Globe,
  Layers,
  MapPin,
  Megaphone,
  Pencil,
  PenTool,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { JobDataType } from "@/app/dashboard/recruiter/jobs/page";
import { DeleteJob } from "@/app/components/DeleteJob";

/** Row shape passed to the table — currently dummy data, later API/Mongo docs. */
export type JobRecord = JobDataType & {
  _id: string;
  createdAt?: string;
  applicants?: number;
};

const categoryStyles: Record<string, { text: string; icon: typeof Code }> = {
  "Engineering & Tech": { text: "text-sky-400", icon: Code },
  "Design & Creative": { text: "text-orange-400", icon: PenTool },
  "Product Management": { text: "text-violet-400", icon: Layers },
  "Marketing & Sales": { text: "text-purple-400", icon: Megaphone },
  // Labels used by the Figma dummy rows
  Engineering: { text: "text-sky-400", icon: Code },
  Design: { text: "text-orange-400", icon: PenTool },
  Infrastructure: { text: "text-sky-400", icon: Cloud },
  Marketing: { text: "text-purple-400", icon: Megaphone },
  Quality: { text: "text-violet-400", icon: ShieldCheck },
};

const defaultCategoryStyle = { text: "text-indigo-400", icon: Briefcase };

function unitFor(salaryType: string): string {
  switch (salaryType) {
    case "Per hour":
      return "/ hr";
    case "Per month":
      return "/ mo";
    case "Per year":
      return "/ yr";
    default:
      return "";
  }
}

function formatSalary(job: JobRecord): string {
  const toAmount = (value: string): string | null => {
    const n = Number(value);
    if (!value.trim() || Number.isNaN(n)) return null;
    return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
  };

  const min = toAmount(job.minSalary);
  const max = toAmount(job.maxSalary);

  if (!min && !max) return "Not specified";

  const range = [min, max]
    .filter(Boolean)
    .map((amount) => `€${amount}`)
    .join(" – ");
  const unit = unitFor(job.salaryType);

  return unit ? `${range} ${unit}` : range;
}

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

/* ---------- Shared pieces (used by both the card and table layouts) ---------- */

function StatusBadge({ expired }: { expired: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          expired ? "bg-gray-500" : "bg-emerald-500"
        }`}
      />
      <span className={expired ? "text-gray-400" : "text-emerald-400"}>
        {expired ? "Expired" : "Active"}
      </span>
    </span>
  );
}

function CompanyBlock({ job }: { job: JobRecord }) {
  return (
    <div className="min-w-0">
      <p className="font-medium text-gray-100">{job.company}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
        {job.isRemote ? (
          <Globe className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <MapPin className="h-3.5 w-3.5 shrink-0" />
        )}
        <span className="truncate">
          {job.isRemote
            ? job.location
              ? `Remote (${job.location})`
              : "Remote"
            : job.location || "No location"}
        </span>
      </p>
    </div>
  );
}

function JobActions({
  job,
  expanded,
  onToggle,
}: {
  job: JobRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/dashboard/recruiter/jobs?edit=${job._id}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
      >
        <Pencil className="h-3.5 w-3.5" />
        Update
      </Link>

        <DeleteJob job={job} />
     
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`More actions for ${job.title}`}
          className="p-1.5 text-gray-400 transition hover:text-white"
        >
          <EllipsisVertical className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-[#121316] text-white ring-[#22252A]"
        >
          <DropdownMenuItem
            onClick={onToggle}
            className="focus:bg-[#1A1D22] focus:text-white"
          >
            {expanded ? "Hide details" : "View details"}
          </DropdownMenuItem>

          <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
            Delete job
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** Description / responsibilities / requirements — shown when a row or card is expanded. */
function JobDetails({ job }: { job: JobRecord }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <h4 className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
          Description
        </h4>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-gray-300">
          {job.description || "—"}
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
          Responsibilities
        </h4>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-gray-300">
          {job.responsibilities || "—"}
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
          Requirements
        </h4>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-gray-300">
          {job.requirements || "—"}
        </p>
      </div>
    </div>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-wider text-gray-500 uppercase">
      {children}
    </p>
  );
}

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
      <div className="mx-auto max-w-md rounded-xl border border-[#22252A] bg-[#0C0D10] px-6 py-12 text-center sm:py-16">
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
          const style = categoryStyles[job.category] ?? defaultCategoryStyle;
          const CategoryIcon = style.icon;
          const expired = isExpired(job.deadline);
          const expanded = expandedId === job._id;

          return (
            <li
              key={job._id}
              className="overflow-hidden rounded-xl border border-[#22252A] bg-[#0C0D10]"
            >
              {/* Tappable header */}
              <button
                type="button"
                onClick={() => toggleDetails(job._id)}
                aria-expanded={expanded}
                className="flex w-full cursor-pointer items-start gap-3 p-4 text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A1D22]">
                  <CategoryIcon className={`h-4 w-4 ${style.text}`} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-white">
                    {job.title}
                  </span>
                  <span className={`block text-xs ${style.text}`}>
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
                  <span className="mt-1 inline-flex rounded-full bg-[#1E2126] px-3 py-1 text-xs text-gray-300">
                    {job.jobType}
                  </span>
                </div>

                <div className="min-w-0">
                  <MetaLabel>Compensation</MetaLabel>
                  <p className="mt-1 text-sm font-medium text-gray-100">
                    {formatSalary(job)}
                  </p>
                </div>

                <div className="min-w-0">
                  <MetaLabel>Deadline</MetaLabel>
                  <p className="mt-1 text-sm text-gray-200">
                    {formatDeadline(job.deadline)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {expired ? "Closed" : postedAgo(job)}
                  </p>
                </div>

                <div className="min-w-0">
                  <MetaLabel>Applicants</MetaLabel>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-300">
                    <Users className="h-4 w-4 shrink-0 text-gray-400" />
                    {job.applicants ?? 0} Candidates
                  </p>
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
      <div className="hidden overflow-x-auto rounded-xl border border-[#22252A] bg-[#0C0D10] md:block">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#22252A] text-[11px] tracking-wider text-gray-500 uppercase">
              <th className="px-5 py-4 font-medium">Job Title &amp; Dept</th>
              <th className="px-5 py-4 font-medium">Company &amp; Location</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Compensation</th>
              <th className="px-5 py-4 font-medium">Applicants</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Deadline</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => {
              const style = categoryStyles[job.category] ?? defaultCategoryStyle;
              const CategoryIcon = style.icon;
              const expired = isExpired(job.deadline);
              const expanded = expandedId === job._id;

              return (
                <Fragment key={job._id}>
                  <tr
                    onClick={() => toggleDetails(job._id)}
                    className={`cursor-pointer border-b border-[#1A1D22] transition-colors hover:bg-[#121316] ${
                      expanded ? "bg-[#121316]" : ""
                    }`}
                  >
                    {/* Job Title & Dept */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A1D22]">
                          <CategoryIcon className={`h-4 w-4 ${style.text}`} />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {job.title}
                          </p>
                          <p className={`text-xs ${style.text}`}>
                            {job.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company & Location */}
                    <td className="px-5 py-4">
                      <CompanyBlock job={job} />
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[#1E2126] px-3 py-1 text-xs text-gray-300">
                        {job.jobType}
                      </span>
                    </td>

                    {/* Compensation */}
                    <td className="px-5 py-4 font-medium whitespace-nowrap text-gray-100">
                      {formatSalary(job)}
                    </td>

                    {/* Applicants */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-sm text-gray-300">
                        <Users className="h-4 w-4 text-gray-400" />
                        {job.applicants ?? 0} Candidates
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge expired={expired} />
                    </td>

                    {/* Deadline */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-200">
                        {formatDeadline(job.deadline)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {expired ? "Closed" : postedAgo(job)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td
                      className="px-5 py-4"
                      onClick={(event) => event.stopPropagation()}
                    >
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
