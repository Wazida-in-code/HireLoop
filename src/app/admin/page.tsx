import type { Metadata } from "next";
import RoleLanding from "@/components/role-landing";
import { requireRole } from "@/lib/require-role";

// Session gate reads headers + MongoDB on every request — blocking route.
export const instant = false;

export const metadata: Metadata = {
  title: "Admin — HireLoop",
};

export default async function AdminPage() {
  await requireRole("admin");

  return (
    <RoleLanding
      title="Admin Panel"
      description="Platform oversight, user management, and moderation tools will live here."
    />
  );
}
