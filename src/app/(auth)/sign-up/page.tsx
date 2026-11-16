'use client'
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { homeForRole } from "@/lib/roles";
import AuthForm from "@/components/auth-form";
import type { AuthFormData } from "@/lib/types";

export default function SignUpPage() {
    const router = useRouter();

    const handleSignUp = async (data: AuthFormData) => {
        const body = {
            name: data.name as string,
            email: data.email as string,
            password: data.password as string,
            userRole: data.role,
            // image: data.imageUrl || undefined,
            callbackURL: "/"
        };
        const {data: signUpResponse, error} = await signUp.email(body);
        console.log(signUpResponse, error);
        if (error) return;
        router.push(homeForRole(data.role ?? "seeker"));
    };
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />;
}
