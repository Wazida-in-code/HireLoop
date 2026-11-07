import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { homeForRole, type Role } from "@/lib/roles";

/**
 * Server-side role gate for the role pages. Redirects to /sign-in when signed
 * out, and to the user's own role home when they open another role's page.
 *
 * Reads the session (headers + database) per request, so the route must
 * declare `export const instant = false` — it can't be prerendered.
 */
export async function requireRole(role: Role) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== role) {
    redirect(homeForRole(session.user.role));
  }

  return session;
}
