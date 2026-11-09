'use client'
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { homeForRole } from "@/lib/roles";
import AuthForm from "@/components/auth-form";
import type { AuthFormData } from "@/lib/types";

export default function SignUpPage() {
    const router = useRouter();

    const handleSignUp = async (data: AuthFormData) => {
        // Built as a variable, not an inline literal: better-auth accepts these
        // fields at runtime (input: true additionalFields), but its client types
        // only infer extra sign-up fields from plugins — an inline literal
        // fails TS2353, a variable passes structural assignability.
        const body = {
            name: data.name as string,
            email: data.email as string,
            password: data.password as string,
            role: data.role,
            callbackURL: "/"
        };
        const {data: signUpResponse, error} = await signUp.email(body);
        console.log(signUpResponse, error);
        if (error) return;
        // Send each role to its own page; matches the server's defaultValue
        // when the form somehow omits the role.
        router.push(homeForRole(data.role ?? "seeker"));
    };
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />;
}
