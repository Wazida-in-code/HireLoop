'use client'
import type { Metadata } from "next";
import AuthForm, { AuthFormData } from "@/components/auth-form";
import { signIn } from "@/lib/auth-client";

// export const metadata: Metadata = {
//   title: "Sign In — HireLoop",
// };

export default function SignInPage() {
    const handleSignIn = async(data: AuthFormData) => {
        const {data:signInRespons, error} = await signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true,
            callbackURL: "/"
        })
        console.log(signInRespons, error);
    }
  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />;
}
