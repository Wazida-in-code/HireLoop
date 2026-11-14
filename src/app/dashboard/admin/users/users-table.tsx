"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, Users, X } from "lucide-react";
import type { Role } from "@/lib/types";
import { updateUserRole } from "@/lib/actions/applications";

/** HireLoop's three roles, in declaration order from @/lib/types. */
const ROLES: Role[] = ["seeker", "recruiter", "admin"];

const roleLabel: Record<Role, string> = {
  seeker: "Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
};

/** Badge colours per role. */
const roleStyles: Record<Role, string> = {
  seeker: "bg-[#1E2126] text-gray-300",
  recruiter: "bg-indigo-500/15 text-indigo-300",
  admin: "bg-purple-500/15 text-purple-300",
};

/** Options in the "All Roles" filter. */
const FILTER_OPTIONS: { value: "All" | Role; label: string }[] = [
  { value: "All", label: "All Roles" },
  { value: "seeker", label: "Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
];

const PANEL = "overflow-hidden rounded-xl border border-[#22252A] bg-[#121316]";
const CELL = "px-5 py-4";
const TH = "px-5 py-4 font-medium";

/**
 * The fields this table needs from a Better Auth user.
 * A structural subset — the page passes `getUsers()` rows straight through.
 */
export type UserRow = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date | string;
  role?: string | null;
  banned?: boolean | null;
};

/** Better Auth stores role as a free string — narrow it to HireLoop's three roles. */
function toRole(value: string | null | undefined): Role {
  return value === "admin" || value === "recruiter" ? value : "seeker";
}

/** "Oct 12, 2023" from a join date. */
function formatDate(createdAt: Date | string): string {
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

type Props = {
  /** Every user from `getUsers()` — the page passes them straight through. */
  users: UserRow[];
};

/** Admin "User Management" table: search, role filter, export, role toggle. */
export default function UsersTable({ users }: Props) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");

  // Role changes made in this table — local state only, not saved yet.
  const [roleEdits, setRoleEdits] = useState<Record<string, Role>>({});

  /** Current role: the admin's edit if there is one, else the stored role. */
  const roleOf = (user: UserRow): Role =>
    roleEdits[user.id] ?? toRole(user.role);

  /** Switch one user to a different role. */
  // TODO: replace the state update with your role-update logic
  //       (e.g. auth.api.setRole or PATCH /users/:id/role).
  const handleRoleChange = async (id: string, role: Role) => {
    const result = await updateUserRole(id, role)
    console.log(result);
    if (result.modifiedCount > 0) {
    setRoleEdits((prev) => ({...prev,[id]: role,}));
  }
  };

  // TODO: implement the export when ready (e.g. build a CSV from `filtered`).
  const handleExport = () => {
    console.log("Export List — not implemented yet.");
  };

  // Users whose name or email matches the search box.
  const trimmed = query.trim().toLowerCase();
  const filtered = users.filter((user) => {
    const matchesQuery =
      user.name.toLowerCase().includes(trimmed) ||
      user.email.toLowerCase().includes(trimmed);
    const matchesRole = roleFilter === "All" || roleOf(user) === roleFilter;
    return matchesQuery && matchesRole;
  });

  const clearFilters = () => {
    setQuery("");
    setRoleFilter("All");
  };

  /* ---------- Empty state: no accounts exist at all ---------- */

  if (users.length === 0) {
    return (
      <div className={`${PANEL} px-6 py-16 text-center`}>
        <Users className="mx-auto h-10 w-10 text-gray-600" />
        <h2 className="mt-4 text-base font-semibold text-white">
          No users yet
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Registered accounts will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className={PANEL}>
      {/* Toolbar: search + role filter + export */}
      <div className="flex flex-col gap-3 border-b border-[#22252A] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-[#22252A] bg-[#121316] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as "All" | Role)
            }
            aria-label="Filter users by role"
            className="rounded-lg border border-[#22252A] bg-[#121316] px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 [&>option]:bg-[#121316]"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
          >
            Export List
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        /* No rows match the current search / filter */
        <div className="px-6 py-16 text-center">
          <h2 className="text-base font-semibold text-white">No matches</h2>
          <p className="mt-1 text-sm text-gray-500">
            Try a different search or role filter.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#22252A] bg-[#1E2126] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#22252A] text-[11px] tracking-wider text-gray-500 uppercase">
                  <th className={TH}>User Name</th>
                  <th className={TH}>Email Address</th>
                  <th className={TH}>Role</th>
                  <th className={TH}>Join Date</th>
                  <th className={TH}>Status</th>
                  <th className={`${TH} text-right`}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((user) => {
                  const currentRole = roleOf(user);
                  const suspended = Boolean(user.banned);

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-[#22252A] transition-colors last:border-0 hover:bg-[#16181D]"
                    >
                      {/* User name + avatar (photo when linked, else initials) */}
                      <td className={`${CELL} whitespace-nowrap`}>
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={`${user.name} avatar`}
                              width={36}
                              height={36}
                              unoptimized
                              className="h-9 w-9 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A1D22] text-sm font-semibold text-indigo-400">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="font-medium text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      <td className={`${CELL} break-all text-gray-400`}>
                        {user.email}
                      </td>

                      {/* Role badge — follows the toggle instantly */}
                      <td className={`${CELL} whitespace-nowrap`}>
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${roleStyles[currentRole]}`}
                        >
                          {roleLabel[currentRole]}
                        </span>
                      </td>

                      <td className={`${CELL} whitespace-nowrap text-gray-400`}>
                        {formatDate(user.createdAt)}
                      </td>

                      <td className={`${CELL} whitespace-nowrap`}>
                        {suspended ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Role toggle: current role is filled; click another to switch */}
                      <td className={`${CELL} whitespace-nowrap text-right`}>
                        <div className="inline-flex rounded-lg border border-[#22252A] bg-[#121316] p-0.5">
                          {ROLES.map((role) => {
                            const isActive = role === currentRole;

                            return (
                              <button
                                key={role}
                                type="button"
                                disabled={isActive}
                                onClick={() => handleRoleChange(user.id, role)}
                                aria-label={`Make ${user.name} ${roleLabel[role]}`}
                                title={
                                  isActive
                                    ? "Current role"
                                    : `Make ${user.name} ${roleLabel[role]}`
                                }
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                                  isActive
                                    ? "cursor-default bg-indigo-600 text-white"
                                    : "text-gray-400 hover:bg-[#1E2126] hover:text-white"
                                }`}
                              >
                                {roleLabel[role]}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Result count */}
          <div className="border-t border-[#22252A] px-5 py-3 text-xs text-gray-500">
            Showing {filtered.length} of {users.length} user
            {users.length === 1 ? "" : "s"}
          </div>
        </>
      )}
    </div>
  );
}
