import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CategoryTile, CompanyBlock, TypePill } from "@/components/job-ui";
import { getApplications } from "@/lib/api/applications";
import { getJobById } from "@/lib/api/jobs";
import { requireRole } from "@/lib/require-role";
import type { ApplicationStatus } from "@/lib/types";
import ApplicantsTable from "./applicants-table";

export const metadata: Metadata = {
  title: "Applicants — HireLoop",
};

type Props = {
  params: Promise<{ id: string }>;
};

function StatCard({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[#22252A] bg-[#121316] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

/** One job's applicants: header, statistics, and the searchable table. */
export default async function JobApplicationsPage({ params }: Props) {
  await requireRole("recruiter");

  const { id } = await params;

  // The job itself — powers the header (title, company, type).
  const job = await getJobById(id);
  if (!job) notFound(); // unknown job id → Next's 404 page

  // Only the applications that belong to this job.
  const applications = await getApplications(`jobId=${id}`);

  // How many applications are in each status (drives the stat cards).
  const countBy = (status: ApplicationStatus) =>
    applications.filter((application) => application.status === status).length;

  return (
    <div className="min-h-screen bg-[#090A0C] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back to Manage Jobs */}
        <Link
          href="/dashboard/recruiter/manage-jobs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Manage Jobs
        </Link>

        {/* Selected job's information */}
        <section className="mt-4 rounded-xl border border-[#22252A] bg-[#121316] p-5 sm:p-6">
          <div className="flex flex-wrap items-start gap-4">
            <CategoryTile category={job.category} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Applicants for</p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                {job.title}
              </h1>
              <CompanyBlock job={job} />
            </div>
            <TypePill type={job.jobType} />
          </div>
        </section>

        {/* Statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total Applicants" value={applications.length} />
          <StatCard
            label="Applied"
            value={countBy("Applied")}
            accent="text-emerald-400"
          />
          <StatCard
            label="Shortlisted"
            value={countBy("Shortlisted")}
            accent="text-blue-400"
          />
          <StatCard
            label="Interview"
            value={countBy("Interview")}
            accent="text-indigo-400"
          />
          <StatCard
            label="Rejected"
            value={countBy("Rejected")}
            accent="text-red-400"
          />
        </div>

        {/* Applicants table (search + status filter + details) */}
        <div className="mt-6">
          <ApplicantsTable applications={applications} />
        </div>
      </div>
    </div>
  );
}
