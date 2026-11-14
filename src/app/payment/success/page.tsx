import { paymentVerify } from "@/lib/actions/payments";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Crown, ArrowRight, Sparkles } from "lucide-react";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id.");
  }

  const {
    status,
    payment_status,
    customer_email,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete" && payment_status === "paid") {
    const result = await paymentVerify(session_id);

    return (
      <main className="flex min-h-[85vh] items-center justify-center bg-[#090A0C] px-4 py-16">
        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#292C32] bg-[#121316] p-8 text-center shadow-2xl sm:p-12">

          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative">
            {/* Success icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle2 className="h-11 w-11 text-emerald-400" />
            </div>

            <div className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-blue-400">
              <Sparkles className="h-4 w-4" />
              PAYMENT SUCCESSFUL
              <Sparkles className="h-4 w-4" />
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome to HireLoop
              <span className="block text-blue-400">Premium!</span>
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-400 sm:text-base">
              Your payment was successful! You&apos;re now a Premium member.
              Enjoy more opportunities and take your job search to the next level.
            </p>

            {/* Premium membership card */}
            <div className="mt-9 rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-5 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10">
                  <Crown className="h-6 w-6 text-blue-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    HireLoop Premium
                  </h2>
                  <p className="mt-1 text-xs text-emerald-400">
                    Membership activated
                  </p>
                </div>

                <span className="ml-auto rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Active
                </span>
              </div>

              {customer_email && (
                <div className="mt-5 border-t border-[#292C32] pt-4">
                  <p className="text-xs text-gray-500">Payment confirmation sent to</p>
                  <p className="mt-1 break-all text-sm text-gray-300">
                    {customer_email}
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              href="/browse-jobs"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Explore Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-5 text-xs text-gray-500">
              Thank you for choosing HireLoop. Your next opportunity starts here!
            </p>
          </div>
        </div>
      </main>
    );
  }

  return redirect("/payment");
}