"use client";

import { Lock } from "lucide-react";

const money = (amount: number) => `$${amount.toFixed(2)}`;

type Props = {
  price: number;
};

/** Client-side Pay button — the checkout logic goes here. */
export default function PaymentButton({ price }: Props) {
  return (
    <button
      type="submit"
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#090A0C] transition hover:bg-gray-200"
    >
      <Lock className="h-4 w-4" aria-hidden="true" />
      Pay {money(price)}
    </button>
  );
}
