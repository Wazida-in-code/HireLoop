import React from 'react';

// Subtle stars scattered over the striped background — same as /browse-jobs.
const stars = [
    { left: "6%", top: "8%", size: 2, className: "bg-white/30" },
    { left: "14%", top: "22%", size: 2, className: "bg-white/20" },
    { left: "9%", top: "44%", size: 3, className: "bg-[#8b9cff]/40" },
    { left: "22%", top: "60%", size: 2, className: "bg-white/25" },
    { left: "30%", top: "14%", size: 2, className: "bg-white/20" },
    { left: "68%", top: "10%", size: 2, className: "bg-white/20" },
    { left: "84%", top: "26%", size: 2, className: "bg-white/30" },
    { left: "92%", top: "48%", size: 3, className: "bg-[#8b9cff]/40" },
    { left: "76%", top: "66%", size: 2, className: "bg-white/20" },
    { left: "88%", top: "78%", size: 2, className: "bg-white/25" },
];

const AdminDashboardPage = () => {
    return (
        <div className="striped-dark relative min-h-screen overflow-hidden text-white">
            {/* Decorative stars + glow — static markup only, so it stays prerenderable. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {stars.map(({ left, top, size, className }) => (
                    <span
                        key={`${left}-${top}`}
                        className={`absolute rounded-full ${className}`}
                        style={{ left, top, width: size, height: size }}
                    />
                ))}
                {/* Soft purple glow, bottom-right. */}
                <span className="absolute -right-24 -bottom-32 h-72 w-72 rounded-full bg-[#5b50e6]/25 blur-3xl" />
            </div>

            <div className="relative px-4 py-8 sm:px-6">
                <h1>AdminDashboardPage</h1>
            </div>
        </div>
    );
};

export default AdminDashboardPage;