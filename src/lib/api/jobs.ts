import type { JobRecord } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getJobs = async (query = ''): Promise<JobRecord[]> => {
    const res = await fetch(`${BASE_URL}/jobs?${query}`);
    return res.json();
}

/** One job by id — tries GET /jobs/:id, then falls back to scanning the list. */
export const getJobById = async (id: string): Promise<JobRecord | null> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs/${id}`);
        if (res.ok) return res.json();
    } catch {
        // Endpoint unreachable — fall through to the list lookup below.
    }

    const jobs = await getJobs();
    return jobs.find((job) => job._id === id) ?? null;
}