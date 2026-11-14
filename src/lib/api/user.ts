import { headers } from "next/headers";
import { auth } from "../auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getPremiumUserId = async(userId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/premium`);  ///users/:id/premium
    return res.json()
}


export const getUsers = async() => {
    const users = await auth.api.listUsers({
    query: {
        sortBy: "name", 
        sortDirection: "desc", 
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});
    return users
}