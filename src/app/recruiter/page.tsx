import type { Metadata } from "next";
import RoleLanding from "@/components/role-landing";
import { requireRole } from "@/lib/require-role";

// Session gate reads headers + MongoDB on every request — blocking route.

export const metadata: Metadata = {
  title: "Recruiter — HireLoop",
};

export default async function RecruiterPage() {
  await requireRole("recruiter");

  return (
    <RoleLanding
      title="Recruiter Dashboard"
      description="Your job postings, applicants, and company team will live here."
    />
  );
}
