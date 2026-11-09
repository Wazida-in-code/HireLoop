import { JobDataType } from "@/app/dashboard/recruiter/jobs/page";
import { JobRecord } from "@/app/dashboard/recruiter/manage-jobs/jobs-table";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createJob = async (data: JobDataType) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return res.json()
}


export const DeleteJobData = async({id}:{ id: string }) => {
        const res = await fetch(`${BASE_URL}/jobs/${id}`, {
            method: "DELETE",
        })
        return res.json();
    }
