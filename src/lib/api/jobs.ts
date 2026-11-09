import type { JobRecord } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getJobs = async (): Promise<JobRecord[]> => {
    const res = await fetch(`${BASE_URL}/jobs`);
    return res.json();
}