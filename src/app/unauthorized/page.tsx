"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090A0C] px-4 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-[#22252A] bg-[#121316] p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
          <ShieldAlert size={38} className="text-red-400" />
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          Access Denied
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Unauthorized Access
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-gray-400">
          Sorry, you don&apos;t have permission to access this page. Please make
          sure you&apos;re signed in with an account that has the required access.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#30343B] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-[#22252A]"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        <p className="mt-8 border-t border-[#22252A] pt-5 text-xs text-gray-600">
          HireLoop · Secure access for everyone
        </p>
      </div>
    </main>
  );
}