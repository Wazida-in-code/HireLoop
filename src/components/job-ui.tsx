"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ClipboardList,
  EllipsisVertical,
  Globe,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { JobRecord } from "@/lib/types";
import { DeleteJob } from "@/app/components/DeleteJob";

/* ---------- Category (dept) accent: color + icon ---------- */

// Defined in `lib/category` so Server Components can use it too.
export { getCategoryStyle } from "@/lib/category";
import { getCategoryStyle } from "@/lib/category";

/** Dark rounded tile holding the category icon — used in both card and table rows. */
export function CategoryTile({ category }: { category: string }) {
  const style = getCategoryStyle(category);
  const Icon = style.icon;

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A1D22]">
      <Icon className={`h-4 w-4 ${style.text}`} />
    </span>
  );
}

/* ---------- Small presentational pieces ---------- */

export function StatusBadge({ expired }: { expired: boolean }) {
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

export function TypePill({
  type,
  icon,
  className,
}: {
  type: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#1E2126] px-3 py-1 text-xs text-gray-300 ${className ?? ""}`}
    >
      {icon}
      {type}
    </span>
  );
}

export function SalaryText({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <p className={`font-medium text-gray-100 ${className ?? ""}`}>{value}</p>
  );
}

/** Deadline date + "Posted …" / "Closed" sub-line (both pre-formatted). */
export function DeadlineBlock({
  date,
  sub,
  className,
}: {
  date: string;
  sub: string;
  className?: string;
}) {
  return (
    <>
      <p className={`text-sm text-gray-200 ${className ?? ""}`}>{date}</p>
      <p className="mt-0.5 text-xs text-gray-500">{sub}</p>
    </>
  );
}

export function ApplicantsCount({
  count,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 text-sm text-gray-300 ${className ?? ""}`}
    >
      <Users className="h-4 w-4 shrink-0 text-gray-400" />
      {count ?? 0} Candidates
    </span>
  );
}

/** Small uppercase caption above a value (used in the mobile card meta grid). */
export function MetaLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] tracking-wider text-gray-500 uppercase">
      {children}
    </p>
  );
}

export function CompanyBlock({ job }: { job: JobRecord }) {
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

/* ---------- Composite pieces ---------- */

export function JobActions({
  job,
  expanded,
  onToggle,
}: {
  job: JobRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href={`/dashboard/recruiter/jobs/${job._id}/applications`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20"
      >
        <ClipboardList className="h-3.5 w-3.5" />
        View Applications
      </Link>

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
export function JobDetails({ job }: { job: JobRecord }) {
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
