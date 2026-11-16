'use server'
import { protectedMutation } from "../core/server";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"


export const updateApplicationStatus = async(id: string, data : {status: string}) => {
    const res = await fetch(`${BASE_URL}/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
};


export const updateUserRole = async(userId: string, role : "seeker" | "recruiter" | "admin") => {
  const api = `${BASE_URL}/users/${userId}/role`
    const res = await protectedMutation(api, "PATCH", {role})
    return res.json();
};
