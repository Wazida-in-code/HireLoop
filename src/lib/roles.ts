export type Role = "seeker" | "recruiter" | "admin";

export const roleHome: Record<Role, string> = {
  seeker: "/seeker",
  recruiter: "/recruiter",
  admin: "/admin",
};

/** Role home with a safe fallback for unknown or missing values. */
export function homeForRole(role: string | undefined): string {
  if (!role || !(role in roleHome)) return "/";
  return roleHome[role as Role];
}
