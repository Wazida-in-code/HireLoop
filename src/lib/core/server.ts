import "server-only";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export const getServerSession = async () => {
    // "use server";
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
};


export const requireRole = async (role: string) => {
    const session = await getServerSession();
    if(!session || session?.user.userRole !== role){
        redirect('/unauthorized');
    }
    return session
}


export const getToken = async() => {
    const session = await getServerSession();
    if(!session || !session.session?.token){
        redirect('/unauthorized')
    }
    return session.session.token;
}


export const authFetch = async(api: string) => {
    const token = await getToken();
    const res = await fetch(api, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    if(res.status === 401 || res.status === 403){
        redirect('/unauthorized')
    }
    return res;
}


export const protectedMutation = async(api: string, method: string, data?: unknown) =>{
    const token = await getToken();
    const res = await fetch(api, {
        method: method, 
        headers: {
            'Content-Type' : 'application/json',
            authorization: `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : null
    })
    if(res.status === 401 || res.status === 403){
        redirect('/unauthorized')
    }
    return res;
}