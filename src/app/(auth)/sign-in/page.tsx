'use client'
import { useRouter } from "next/navigation";
import AuthForm, { AuthFormData } from "@/components/auth-form";
import { signIn } from "@/lib/auth-client";
import { homeForRole } from "@/lib/roles";

export default function SignInPage() {
    const router = useRouter();

    const handleSignIn = async (data: AuthFormData) => {
        const { data: signInResponse, error } = await signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true,
            callbackURL: "/"
        });
        console.log(signInResponse, error);
        if (error) return;
        // The returned user's `role` isn't part of better-auth's client types,
        // so read it off a widened view of the response.
        const role = (signInResponse?.user as { role?: string } | undefined)?.role;
        router.push(homeForRole(role ?? "seeker"));
    };
  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />;
}
