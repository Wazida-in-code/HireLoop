/** The four numbers + notes shown in the stat cards (computed by the page). */
export type UserStatsData = {
  totalActive: number;
  activeNote: string;
  recruiters: number;
  recruiterNote: string;
  suspended: number;
  suspendedNote: string;
  signups24h: number;
  signupsNote: string;
};

function StatCard({
  label,
  value,
  note,
  noteAccent,
}: {
  label: string;
  value: number;
  note: string;
  noteAccent: string;
}) {
  return (
    <div className="rounded-xl border border-[#22252A] bg-[#121316] p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className={`mt-1 text-xs ${noteAccent}`}>{note}</p>
    </div>
  );
}

/** Four stat cards for the admin "User Management" page. */
export default function UserStats({ stats }: { stats: UserStatsData }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Active Users"
        value={stats.totalActive}
        note={stats.activeNote}
        noteAccent="text-emerald-400"
      />
      <StatCard
        label="Recruiter Growth"
        value={stats.recruiters}
        note={stats.recruiterNote}
        noteAccent="text-orange-400"
      />
      <StatCard
        label="Suspended Accounts"
        value={stats.suspended}
        note={stats.suspendedNote}
        noteAccent="text-gray-400"
      />
      <StatCard
        label="New Signups (24h)"
        value={stats.signups24h}
        note={stats.signupsNote}
        noteAccent="text-amber-400"
      />
    </div>
  );
}
