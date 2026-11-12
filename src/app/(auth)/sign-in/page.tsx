'use client'
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/components/auth-form";
import type { AuthFormData } from "@/lib/types";
import { signIn } from "@/lib/auth-client";
import { homeForRole } from "@/lib/roles";

/**
 * `useSearchParams()` must sit inside a Suspense boundary, otherwise the
 * production build refuses to prerender this page
 * (missing-suspense-with-csr-bailout).
 */
export default function SignInPage() {
    return (
        <Suspense fallback={<SignInFallback />}>
            <SignInForm />
        </Suspense>
    );
}

function SignInFallback() {
    return (
        <section className="striped-dark flex min-h-screen items-center justify-center px-4 py-12">
            <p className="text-sm text-gray-500">Loading…</p>
        </section>
    );
}

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? "/"

    const handleSignIn = async (data: AuthFormData) => {
        const { data: signInResponse, error } = await signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true,
            callbackURL: redirectTo
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
