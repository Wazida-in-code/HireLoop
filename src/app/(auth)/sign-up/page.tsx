'use client'
import type { Metadata } from "next";
import { signUp } from "@/lib/auth-client";
import AuthForm, { AuthFormData } from "@/components/auth-form";

// export const metadata: Metadata = {
//   title: "Sign Up — HireLoop",
// };

export default function SignUpPage() {
    const handleSignUp = async (data: AuthFormData) => {
        const {data: signUpResponse, error} = await signUp.email({
            name: data.name as string,
            email: data.email as string,
            password: data.password as string,
            callbackURL: "/"
        })
        console.log(signUpResponse, error);
    }
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />;
}
