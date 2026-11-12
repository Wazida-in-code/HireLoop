import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  BadgeDollarSign,
  Briefcase,
  Brain,
  Building,
  CircleCheckBig,
  Code,
  DollarSign,
  HeartPulse,
  MapPin,
  MonitorSmartphone,
  PenTool,
  Plane,
  ChartColumn,
  type LucideIcon,
} from "lucide-react";
import { getCategoryStyle } from "@/lib/category";
import { getJobById } from "@/lib/api/jobs";
import { formatSalary } from "@/lib/format";
import type { JobRecord } from "@/lib/types";
import JobActions from "./job-actions";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Placeholder perks — the jobs API has no benefits field yet, so every post
 * shows the default set from the design. Swap for `job.benefits` once it exists.
 */
const BENEFITS: { icon: LucideIcon; label: string }[] = [
  { icon: HeartPulse, label: "Full Health & Dental" },
  { icon: BadgeDollarSign, label: "Competitive 401k" },
  { icon: MonitorSmartphone, label: "Latest Hardware Stipend" },
  { icon: Plane, label: "Unlimited PTO" },
];

/** Icons cycled across the requirement skill chips. */
const CHIP_ICONS: LucideIcon[] = [PenTool, Brain, CircleCheckBig, Code];

/** "Remote (US)" / "London, UK (Hybrid)" — the location stat value. */
function locationLabel(job: JobRecord): string {
  if (!job.location) return job.isRemote ? "Remote" : "Location not specified";
  return job.isRemote ? `Remote (${job.location})` : job.location;
}

/** Best-effort experience level ("5+ Years"), read out of the requirements text. */
function experienceLabel(job: JobRecord): string {
  const match = /(\d+\+)\s*years?/i.exec(job.requirements ?? "");
  return match ? `${match[1]} Years` : "Not specified";
}

/** Newline-separated text → bullet items (single long lines fall back to sentences). */
function toList(text: string): string[] {
  const lines = (text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 1 && lines[0].includes(". ")) {
    return lines[0]
      .split(/(?<=\.)\s+/)
      .map((line) => line.trim().replace(/\.$/, ""))
      .filter(Boolean);
  }

  return lines;
}

/* ---------- Small building blocks ---------- */

function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#22252A] bg-[#121316] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#22252A] bg-[#121316] p-4">
      <p className="flex items-center gap-2 text-[11px] tracking-wider text-gray-500 uppercase">
        <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-gray-500">—</p>;

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-400">
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ---------- Page ---------- */

export default async function JobDetails({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) notFound();

  const CategoryIcon = getCategoryStyle(job.category).icon;
  const requirements = toList(job.requirements);
  // Short requirement lines double as the skill chips above the list.
  const chips = requirements.filter((item) => item.length <= 34).slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Header */}
      <article className="rounded-xl border border-[#22252A] bg-[#121316] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1A1D22]">
              <CategoryIcon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold break-words text-white sm:text-2xl">
                {job.title}
              </h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                <span>{job.company}</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  Verified Employer
                </span>
              </p>
            </div>
          </div>

          <JobActions title={job.title} />
        </div>
      </article>

      {/* Body + company sidebar */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* Stats — sits above the description cards, inside this column */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard icon={DollarSign} label="Salary Range" value={formatSalary(job)} />
            <StatCard icon={MapPin} label="Location" value={locationLabel(job)} />
            <StatCard icon={Briefcase} label="Job Type" value={job.jobType} />
            <StatCard
              icon={ChartColumn}
              label="Experience"
              value={experienceLabel(job)}
            />
          </div>

          <Card title="Job Description">
            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-400">
              {job.description || "—"}
            </p>
          </Card>

          <Card title="Responsibilities">
            <BulletList items={toList(job.responsibilities)} />
          </Card>

          <Card title="Requirements">
            {chips.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {chips.map((chip, index) => {
                  const ChipIcon = CHIP_ICONS[index % CHIP_ICONS.length];
                  return (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#1E2126] px-2.5 py-1.5 text-xs font-medium text-gray-300"
                    >
                      <ChipIcon className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                      {chip}
                    </span>
                  );
                })}
              </div>
            )}
            <BulletList items={requirements} />
          </Card>

          <Card title="Benefits">
            <ul className="grid gap-4 sm:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A1D22]">
                    <Icon className="h-4 w-4 text-gray-300" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-gray-200">{label}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20">
          <section className="rounded-xl border border-[#22252A] bg-[#121316] p-5 sm:p-6">
            <h2 className="text-base font-semibold text-white">Company Overview</h2>

            {/* No company cover image in the API yet — icon placeholder for now. */}
            <div className="mt-4 flex aspect-[16/9] items-center justify-center rounded-lg bg-[#1A1D22]">
              <Building className="h-10 w-10 text-gray-600" aria-hidden="true" />
            </div>

            <dl className="mt-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-t border-[#22252A] py-3">
                <dt className="text-[11px] tracking-wider text-gray-500 uppercase">Size</dt>
                <dd className="text-right text-gray-200">Not specified</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[#22252A] py-3">
                <dt className="text-[11px] tracking-wider text-gray-500 uppercase">
                  Industry
                </dt>
                <dd className="text-right text-gray-200">
                  {job.category || "Not specified"}
                </dd>
              </div>
            </dl>

            {/* TODO: point at a real company site once the API exposes one. */}
            <button
              type="button"
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border border-[#22252A] bg-[#1A1D22] py-2.5 text-sm font-medium text-gray-300"
            >
              Visit Website
            </button>
          </section>
        </aside>
      </div>

      {/* Back link */}
      <Link
        href="/browse-jobs"
        className="inline-block text-sm text-gray-500 transition hover:text-white"
      >
        ← Back to all jobs
      </Link>
    </div>
  );
}
