"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { toast } from "@/components/ui/toast";

/**
 * Placeholder plan — swap for real pricing data when it exists.
 * The Pay button and the order summary both read from here.
 */
const PLAN = {
  name: "HireLoop Pro",
  price: 29,
  interval: "month",
  features: [
    "Unlimited job applications",
    "Priority support",
    "Resume insights & analytics",
  ],
};

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Bangladesh",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "Netherlands",
];

const money = (amount: number) => `$${amount.toFixed(2)}`;

export default function PaymentForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);

  const handlePay = () => {
    if (!email.trim()) {
      toast.add({ title: "Enter your email to continue.", type: "error" });
      return;
    }

    // TODO: create a Stripe Checkout session on the server, then
    // router.push(session.url) to send the user to Stripe's payment page.
    toast.add({
      title: "Stripe checkout isn't connected yet.",
      type: "info",
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#090A0C] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          <header className="mt-4 mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Complete your payment</h1>
            <p className="mt-2 text-sm text-gray-500">
              Review your details below — you&apos;ll confirm the payment on
              Stripe&apos;s secure checkout.
            </p>
          </header>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* ---------- Payment information ---------- */}
            <section className="rounded-xl border border-[#22252A] bg-[#121316] p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white">
                Payment Information
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs tracking-wider text-gray-500 uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#22252A] bg-[#1A1C21] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#3B4250] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs tracking-wider text-gray-500 uppercase"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full rounded-lg border border-[#22252A] bg-[#1A1C21] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#3B4250] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-1.5 block text-xs tracking-wider text-gray-500 uppercase"
                  >
                    Country or region
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="w-full rounded-lg border border-[#22252A] bg-[#1A1C21] px-3.5 py-2.5 text-sm text-white focus:border-[#3B4250] focus:outline-none [&>option]:bg-[#121316]"
                  >
                    {COUNTRIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Card entry happens on Stripe, not here. */}
              <div className="mt-6 rounded-lg border border-[#22252A] bg-[#1A1C21] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <CreditCard className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    Credit or debit card
                  </p>

                  <div className="flex items-center gap-1.5" aria-label="Accepted cards">
                    {["VISA", "MC", "AMEX"].map((brand) => (
                      <span
                        key={brand}
                        className="rounded border border-[#2E333B] bg-[#121316] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-gray-400"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-2.5 flex items-start gap-2 text-xs text-gray-500">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  You&apos;ll enter your card details on Stripe&apos;s encrypted
                  checkout — we never see or store them.
                </p>
              </div>
            </section>

            {/* ---------- Order summary ---------- */}
            <aside className="rounded-xl border border-[#22252A] bg-[#121316] p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white">Order Summary</h2>

              <div className="mt-5 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1A1D22]">
                  <Sparkles className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{PLAN.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Billed monthly · cancel anytime
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">
                  {money(PLAN.price)}
                </p>
              </div>

              <ul className="mt-4 space-y-2 border-t border-[#22252A] pt-4">
                {PLAN.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-gray-400"
                  >
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-[#22252A] pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="text-gray-300">{money(PLAN.price)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Tax</dt>
                  <dd className="text-gray-300">{money(0)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-[#22252A] pt-3 text-base font-semibold text-white">
                  <dt>Total</dt>
                  <dd>{money(PLAN.price)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handlePay}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#090A0C] transition hover:bg-gray-200"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                Pay {money(PLAN.price)}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                Payments secured by Stripe
              </p>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
