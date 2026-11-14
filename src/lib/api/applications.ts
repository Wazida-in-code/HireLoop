import type { ApplicationRecord, ApplicationStatus } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"


/**
 * All applications for one seeker — feeds the "My Applications" page.
 * Falls back to sample data when the endpoint is missing or errors, so the
 * page always has something to render instead of crashing.
 */
export const getApplications = async (query = "" ): Promise<ApplicationRecord[]> => {
    const res = await fetch(`${BASE_URL}/applications?${query}`)
    return res.json()
}

export const getApplicationsCount = async (query = "" ): Promise<{count:number}> => {
    const res = await fetch(`${BASE_URL}/applications/count?${query}`)
    return res.json()
}

