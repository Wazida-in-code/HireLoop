'use server'
import { JobDataType, ApplicationDataType } from "@/lib/types";
import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createJob = async (data: JobDataType) => {
    const api = `${BASE_URL}/jobs`
    const res = await protectedMutation(api, "POST", data)
    return res.json()
}


export const DeleteJobData = async({id}:{ id: string }) => {
        const res = await fetch(`${BASE_URL}/jobs/${id}`, {
            method: "DELETE",
        })
        return res.json();
    }


export const applyJob = async (data: ApplicationDataType) => {
    const api = `${BASE_URL}/applications`;
    const res = await protectedMutation(api, 'POST', data)
    return res.json()
}
