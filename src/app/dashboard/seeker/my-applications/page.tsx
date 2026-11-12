import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { getApplications } from "@/lib/api/applications";
import { requireRole } from "@/lib/require-role";
import type { ApplicationRecord } from "@/lib/types";
import ApplicationsTable from "./applications-table";
import ExportPdfButton from "./export-pdf-button";

export const metadata: Metadata = {
  title: "My Applications — HireLoop",
};

type Props = {
  searchParams: Promise<{ tab?: string; page?: string }>;
};

/** Applications shown per page (matches the "Showing 1–5" row in the design). */
const PAGE_SIZE = 5;

function countStatus(applications: ApplicationRecord[], status: string) {
  return applications.filter((application) => application.status === status).length;
}

function StatCard({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[#22252A] bg-[#121316] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-[#1E2126] text-white"
          : "text-gray-500 hover:text-gray-300"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function MyApplicationsPage({ searchParams }: Props) {
  const session = await requireRole("seeker");
  const search = await searchParams;
  const applications = await getApplications(
  `userId=${session.user.id}`
  );
  // "Archived" holds rejected applications; everything else is active.
  const isArchived = search.tab === "archived";
  const visible = applications.filter((application) =>
    isArchived ? application.status === "Rejected" : application.status !== "Rejected"
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const requestedPage = Number(search.page);
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), pageCount)
    : 1;
  const rows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const shortlisted = countStatus(applications, "Shortlisted");
  const interviews = countStatus(applications, "Interview");
  const offered = countStatus(applications, "Offered");
  const successRate =
    applications.length === 0
      ? 0
      : // floored so partial rates don't round up — 2 of 16 → 12%, as designed
        Math.floor((offered / applications.length) * 100);

  return (
    <div className="min-h-screen bg-[#090A0C] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">My Applications</h1>
            <p className="mt-2 text-sm text-gray-500">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-[#22252A] bg-[#121316] p-1">
              <TabLink href="/dashboard/seeker/my-applications" active={!isArchived}>
                Active
              </TabLink>
              <TabLink
                href="/dashboard/seeker/my-applications?tab=archived"
                active={isArchived}
              >
                Archived
              </TabLink>
            </div>

            <ExportPdfButton />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Applied" value={String(applications.length)} />
          <StatCard label="Shortlisted" value={String(shortlisted)} />
          <StatCard
            label="Interviews"
            value={String(interviews)}
            accent="text-orange-400"
          />
          <StatCard
            label="Success Rate"
            value={`${successRate}%`}
            accent="text-emerald-400"
          />
        </div>

        {/* Applications */}
        <div className="mt-6">
          <ApplicationsTable
            rows={rows}
            page={page}
            pageCount={pageCount}
            pageSize={PAGE_SIZE}
            totalVisible={visible.length}
            hasAny={applications.length > 0}
            isArchived={isArchived}
          />
        </div>
      </div>
    </div>
  );
}
