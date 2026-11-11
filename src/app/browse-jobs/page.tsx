import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { getJobs } from "@/lib/api/jobs";
import BrowseJobs from "./browse-jobs";

export const metadata: Metadata = {
  title: "Browse Jobs — HireLoop",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BrowseJobsPage({ searchParams }: Props) {
  const search = await searchParams
    const urlSearch = new URLSearchParams(search as Record<string, string>);
    const query = urlSearch.toString()
    const jobs = await getJobs(query)
    const initialQuery = typeof search.q === "string" ? search.q : "";

  return (
    <div className="min-h-screen bg-[#090A0C] text-white">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <BrowseJobs jobs={jobs} initialQuery={initialQuery} />
      </div>
    </div>
  );
}
