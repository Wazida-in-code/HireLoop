import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/require-role";
import { getJobs } from "@/lib/api/jobs";
import JobsTable from "./jobs-table";
import { getServerSession } from "@/lib/core/server";

export const metadata: Metadata = {
  title: "Manage Jobs — HireLoop",
};

export default async function ManageJobsPage() {
  const session = await getServerSession()
  await requireRole("recruiter");
  const jobs = await getJobs(`recruiterId=${session?.user.id}`)

  return (
    <div className="min-h-screen bg-[#090A0C] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[#22252A] pb-6">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
              Manage Jobs <span className="text-gray-600">›</span>
              <span className="text-gray-400">Job Listings &amp; Postings</span>
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">Manage Job Posts</h1>

            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            New Job Post
          </Link>
        </div>

        <JobsTable jobs={jobs} />
      </div>
    </div>
  );
}
