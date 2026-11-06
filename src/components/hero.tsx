import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, MapPin, Search } from "lucide-react";
import globe from "@/app/images/globe.png";

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev ops Engineer",
];

// Subtle stars scattered in the dark area above the globe.
const stars = [
  { left: "6%", top: "14%", size: 2, className: "bg-white/30" },
  { left: "14%", top: "34%", size: 2, className: "bg-white/20" },
  { left: "9%", top: "56%", size: 3, className: "bg-[#8b9cff]/40" },
  { left: "20%", top: "72%", size: 2, className: "bg-white/25" },
  { left: "27%", top: "20%", size: 2, className: "bg-white/20" },
  { left: "70%", top: "12%", size: 2, className: "bg-white/20" },
  { left: "84%", top: "18%", size: 2, className: "bg-white/30" },
  { left: "91%", top: "42%", size: 3, className: "bg-[#8b9cff]/40" },
  { left: "78%", top: "64%", size: 2, className: "bg-white/20" },
  { left: "88%", top: "78%", size: 2, className: "bg-white/25" },
];

export default function Hero() {
  return (
    <section className="striped-dark relative overflow-hidden">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-14 pb-2 text-center sm:pt-16">
        {/* Stars behind the copy */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {stars.map(({ left, top, size, className }) => (
            <span
              key={`${left}-${top}`}
              className={`absolute rounded-full ${className}`}
              style={{ left, top, width: size, height: size }}
            />
          ))}
        </div>

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] sm:px-4 sm:text-xs">
          <BriefcaseBusiness size={16} color="#6B4226" />
          <span className="font-semibold text-orange-400">50,000+</span>
          <span className="tracking-[0.15em] text-white/60">
            NEW JOBS THIS MONTH
          </span>
        </div>

        {/* Heading */}
        <h1 className="relative mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Find Your Dream Job Today
        </h1>

        {/* Subtext */}
        <p className="relative mt-4 max-w-2xl text-sm text-white/60 sm:text-base">
          HireLoop connects top-talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <form
          action="/jobs"
          className="relative mt-8 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#1b1010] p-2 sm:flex-row sm:items-center sm:gap-0 sm:rounded-xl sm:p-1.5"
        >
          <label className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 sm:rounded-none">
            <Search className="size-4 shrink-0 text-white/40" aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Job title, skill or company"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </label>
          <span
            aria-hidden="true"
            className="hidden h-6 w-px bg-white/10 sm:block"
          />
          <label className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 sm:rounded-none">
            <MapPin className="size-4 shrink-0 text-white/40" aria-hidden="true" />
            <input
              type="search"
              name="location"
              placeholder="Location or Remote"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </label>
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#5b50e6] text-white transition-colors hover:bg-[#4a3fd6] focus-visible:ring-2 focus-visible:ring-[#5b50e6]/50 focus-visible:outline-none sm:ml-2 sm:h-10 sm:w-auto sm:px-5"
          >
            <Search className="size-5" aria-hidden="true" />
            <span className="sr-only">Search jobs</span>
          </button>
        </form>

        {/* Trending positions */}
        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span className="text-sm text-white/50">Trending Position</span>
          {trendingPositions.map((position) => (
            <Link
              key={position}
              href="/jobs"
              className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/90 transition-colors hover:border-white/25 hover:text-white sm:text-sm"
            >
              {position}
            </Link>
          ))}
        </div>
      </div>

      {/* Globe */}
      <div className="relative mt-12 h-[310px] overflow-hidden sm:mt-16 sm:h-[420px] lg:h-[540px]">
        <Image
          src={globe}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-[-110px] h-auto w-[640px] max-w-none -translate-x-1/2 sm:top-[-150px] sm:w-[860px] lg:top-[-190px] lg:w-[1100px]"
        />
        <p className="absolute inset-x-0 top-[30%] px-4 text-center text-base text-gray-50 sm:text-lg lg:text-xl">
          Assisting over 15,000 job seekers
          <br />
          find their dream positions.
        </p>
      </div>
    </section>
  );
}
