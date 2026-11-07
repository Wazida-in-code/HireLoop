import type { Metadata } from "next";
import RoleLanding from "@/components/role-landing";
import { requireRole } from "@/lib/require-role";

// Session gate reads headers + MongoDB on every request — blocking route.

export const metadata: Metadata = {
  title: "Job Seeker — HireLoop",
};

export default async function SeekerPage() {
  await requireRole("seeker");

  return (
    <RoleLanding
      title="Job Seeker Dashboard"
      description="Your saved jobs, applications, and recommendations will live here."
    />
  );
}
