"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

type AuthMode = "sign-in" | "sign-up";

export type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
};

interface AuthFormDataProps {
  mode: AuthMode
  onSubmit: (data: AuthFormData) => void | Promise<void>
}

const fieldsByMode: Record<AuthMode, Field[]> = {
  "sign-in": [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      autoComplete: "current-password",
    },
  ],
  "sign-up": [
    {
      name: "name",
      label: "Full name",
      type: "text",
      placeholder: "Ada Lovelace",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      autoComplete: "new-password",
    },
  ],
};

export default function AuthForm({ mode , onSubmit}: AuthFormDataProps) {
  const isSignIn = mode === "sign-in";
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Placeholder: collects the form data now, real auth wiring comes later.
 async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as AuthFormData 
    await onSubmit(data)
  }

  const tabClass = (active: boolean) =>
    `rounded-full px-3 py-2 text-center transition-colors ${
      active ? "bg-[#5b50e6] text-white" : "text-white/60 hover:text-white"
    }`;

  return (
    <section className="striped-dark flex min-h-[calc(100vh_-_4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1010] p-6 shadow-2xl sm:p-8">
        {/* Toggle between sign-in and sign-up */}
        <nav
          aria-label="Authentication"
          className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm font-medium"
        >
          <Link
            href="/sign-in"
            aria-current={isSignIn ? "page" : undefined}
            className={tabClass(isSignIn)}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            aria-current={!isSignIn ? "page" : undefined}
            className={tabClass(!isSignIn)}
          >
            Sign Up
          </Link>
        </nav>

        <h1 className="mt-6 text-center text-2xl font-bold text-white">
          {isSignIn ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-center text-sm text-white/60">
          {isSignIn
            ? "Sign in to continue to HireLoop."
            : "Join HireLoop to find your dream job."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fieldsByMode[mode].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-white/70"
              >
                {field.label}
              </label>
              <div className="relative mt-1.5">
                <input
                  id={field.name}
                  name={field.name}
                  type={
                    field.type === "password" && showPassword
                      ? "text"
                      : field.type
                  }
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required
                  className={`w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-[#5b50e6]/60 focus:ring-2 focus:ring-[#5b50e6]/30 ${
                    field.type === "password" ? "pr-11" : ""
                  }`}
                />
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    onMouseDown={(event) => event.preventDefault()}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-white/40 transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:ring-[#5b50e6]/50"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#5b50e6] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a3fd6] focus-visible:ring-2 focus-visible:ring-[#5b50e6]/50 focus-visible:outline-none"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>

          <p role="status" className="min-h-4 text-center text-xs text-white/50">
            {submitted
              ? "Form data collected — see the browser console. Auth logic comes later."
              : null}
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-medium text-[#a5a0f5] transition-colors hover:text-white"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </section>
  );
}
