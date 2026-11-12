import type { Metadata } from "next";
import PaymentForm from "./payment-form";

export const metadata: Metadata = {
  title: "Payment — HireLoop",
};

/** Checkout is a client flow, so the page only supplies the metadata. */
export default function PaymentPage() {
  return <PaymentForm />;
}
