"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import type { FilterOption, JobRecord } from "@/lib/types";
import FiltersPanel from "./filters-panel";
import JobCard from "./job-card";
import Pagination from "./pagination";
import SearchBar from "./search-bar";
import SortBy from "./sort-by";

/** Jobs per page — the API returns the whole list, so the list is sliced here. */
const PAGE_SIZE = 10;

type Props = {
  jobs: JobRecord[];
  /** Query currently in the URL, so the search input starts out in sync. */
  initialQuery?: string;
};

/** How many jobs have each distinct value of a field — drives the filter counts. */
function countBy(
  jobs: JobRecord[],
  valueOf: (job: JobRecord) => string
): FilterOption[] {
  const counts = new Map<string, number>();

  for (const job of jobs) {
    const value = valueOf(job);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts].map(([value, count]) => ({ value, count }));
}

export default function BrowseJobs({ jobs, initialQuery }: Props) {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const visibleJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filterGroups = [
    { name: "Job Type", options: countBy(jobs, (job) => job.jobType) },
    { name: "Category", options: countBy(jobs, (job) => job.category) },
    {
      name: "Work Mode",
      options: [
        {
          value: "remote",
          label: "Remote",
          count: jobs.filter((job) => job.isRemote).length,
        },
        {
          value: "on-site",
          label: "On-site",
          count: jobs.filter((job) => !job.isRemote).length,
        },
      ],
    },
  ];

  return (
    <>
      <SearchBar initialQuery={initialQuery} />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <FiltersPanel groups={filterGroups} />

        <section aria-label="Job results" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-semibold">
              Found {jobs.length.toLocaleString("en-US")} Professional{" "}
              {jobs.length === 1 ? "Job" : "Jobs"}
            </h1>

            <SortBy />
          </div>

          {visibleJobs.length === 0 ? (
            <div className="mt-4 rounded-xl border border-[#22252A] bg-[#121316] px-6 py-14 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-gray-600" />
              <h2 className="mt-4 text-lg font-semibold">No jobs found</h2>
              <p className="mt-1 text-sm text-gray-500">
                Try a different search or remove a few filters.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {visibleJobs.map((job) => (
                <li key={job._id}>
                  <JobCard job={job} />
                </li>
              ))}
            </ul>
          )}

          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </section>
      </div>
    </>
  );
}
