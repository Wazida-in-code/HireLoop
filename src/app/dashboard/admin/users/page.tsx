import type { Metadata } from "next";
import { requireRole } from "@/lib/require-role";
import UserStats, { type UserStatsData } from "./user-stats";
import UsersTable from "./users-table";
import { getUsers } from "@/lib/api/admin-users";

export const metadata: Metadata = {
  title: "User Management — HireLoop",
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** How long ago the account was created, in milliseconds. */
function ageInMs(createdAt: Date | string): number {
  return Date.now() - new Date(createdAt).getTime();
}

/** Admin users page: header + stat cards + the searchable users table. */
export default async function AdminUsersPage() {
  await requireRole("admin");

  const { users } = await getUsers();

  // `listUsers`' built-in type doesn't include our custom `userRole` field —
  // widen the rows once so every check below can see it.
  type Row = (typeof users)[number] & { userRole?: string };
  const rows = users as Row[];

  /* ----- Numbers for the stat cards (all derived from the list above) ----- */
  const total = rows.length;
  const active = rows.filter((user) => !user.banned).length;
  const suspended = total - active;

  const recruiters = rows.filter((user) => user.userRole === "recruiter").length;

  const recruitersThisMonth = rows.filter(
    (user) => user.userRole === "recruiter" && ageInMs(user.createdAt) < 30 * DAY_MS,).length;
  const signups24h = rows.filter((user) => ageInMs(user.createdAt) < DAY_MS,).length;
  const signupsYesterday = rows.filter((user) => {
    const age = ageInMs(user.createdAt);
    return age >= DAY_MS && age < 2 * DAY_MS;}).length;
  const signupDiff = signups24h - signupsYesterday;

  /** "34% of all users" — returns "0…" instead of dividing by zero. */
  const percent = (count: number, suffix: string) =>
    total === 0
      ? `0${suffix}`
      : `${Math.round((count / total) * 100)}${suffix}`;

  const stats: UserStatsData = {
    totalActive: active,
    activeNote: percent(active, "% of all users"),
    recruiters,
    recruiterNote: `+${recruitersThisMonth} this month`,
    suspended,
    suspendedNote: percent(suspended, "% of total"),
    signups24h,
    signupsNote: `${signupDiff > 0 ? "+" : ""}${signupDiff} vs yesterday`,
  };

  return (
    <div className="min-h-screen bg-[#090A0C] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-[#22252A] pb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">User Management</h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            Review, filter, and manage platform access for all users.
          </p>
        </div>

        <UserStats stats={stats} />

        {/* Users table (search + role filter + export + role toggle) */}
        <div className="mt-6">
          <UsersTable users={rows} />
        </div>
      </div>
    </div>
  );
}
