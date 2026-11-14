const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getPremiumUserId = async(userId: string) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/premium`);  ///users/:id/premium
    return res.json()
}