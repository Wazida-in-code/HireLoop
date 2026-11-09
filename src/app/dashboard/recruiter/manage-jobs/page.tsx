import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/require-role";
import JobsTable, { type JobRecord } from "./jobs-table";

// Session gate reads headers + MongoDB on every request — blocking route.

export const metadata: Metadata = {
  title: "Manage Jobs — HireLoop",
};

// Placeholder rows matching the Figma design — swap for an API fetch later.
const DAY = 86_400_000;
const now = Date.now();
const dayFromNow = (offset: number) =>
  new Date(now + offset * DAY).toISOString().slice(0, 10);
const isoDaysAgo = (days: number) => new Date(now - days * DAY).toISOString();

const DUMMY_JOBS: JobRecord[] = [
  {
    _id: "dummy-1",
    title: "Frontend Developer",
    company: "HirePulse Network",
    category: "Engineering",
    jobType: "Full-time",
    isRemote: true,
    location: "New York, USA",
    deadline: dayFromNow(21),
    minSalary: "25",
    maxSalary: "40",
    salaryType: "Per hour",
    description:
      "Build and maintain the recruiter-facing web app, shipping features end to end.",
    responsibilities:
      "Develop new UI components\nCollaborate with designers and backend engineers\nImprove performance and accessibility",
    requirements:
      "2+ years with React\nStrong TypeScript skills\nEye for detail in UI implementation",
    applicants: 34,
    createdAt: isoDaysAgo(4),
  },
  {
    _id: "dummy-2",
    title: "Senior Product Designer",
    company: "Craftlane Digital",
    category: "Design",
    jobType: "Full-time",
    isRemote: false,
    location: "London, UK (Hybrid)",
    deadline: dayFromNow(35),
    minSalary: "90000",
    maxSalary: "115000",
    salaryType: "Per year",
    description:
      "Own the design of our hiring platform end to end, from research to polished UI.",
    responsibilities:
      "Lead product discovery workshops\nShip design systems and prototypes\nRun usability testing",
    requirements:
      "5+ years in product design\nA strong portfolio of shipped work\nFluency with Figma",
    applicants: 19,
    createdAt: isoDaysAgo(7),
  },
  {
    _id: "dummy-3",
    title: "DevOps Specialist",
    company: "Nordstack Systems",
    category: "Infrastructure",
    jobType: "Full-time",
    isRemote: false,
    location: "Berlin, Germany",
    deadline: dayFromNow(49),
    minSalary: "95000",
    maxSalary: "120000",
    salaryType: "Per year",
    description:
      "Keep our cloud infrastructure reliable, observable, and cost efficient.",
    responsibilities:
      "Manage CI/CD pipelines\nMonitor uptime and incident response\nAutomate infrastructure as code",
    requirements:
      "Experience with AWS and Docker\nStrong scripting skills (Bash/Python)\nOn-call mindset",
    applicants: 12,
    createdAt: isoDaysAgo(2),
  },
  {
    _id: "dummy-4",
    title: "Product Marketing Lead",
    company: "Orbit Media",
    category: "Marketing",
    jobType: "Full-time",
    isRemote: true,
    location: "EU/US",
    deadline: dayFromNow(63),
    minSalary: "80000",
    maxSalary: "105000",
    salaryType: "Per year",
    description:
      "Shape how the market sees us — positioning, launches, and demand campaigns.",
    responsibilities:
      "Plan product launches\nOwn messaging and positioning\nPartner with sales on enablement",
    requirements:
      "4+ years in B2B product marketing\nExcellent written communication\nData-driven mindset",
    applicants: 27,
    createdAt: isoDaysAgo(4),
  },
  {
    _id: "dummy-5",
    title: "QA Automation Engineer",
    company: "Brightpath Labs",
    category: "Quality",
    jobType: "Part-time",
    isRemote: false,
    location: "Dublin, Ireland (Hybrid)",
    deadline: dayFromNow(-30),
    minSalary: "35",
    maxSalary: "50",
    salaryType: "Per hour",
    description:
      "Expand our automated test coverage so every release ships with confidence.",
    responsibilities:
      "Write and maintain E2E tests\nTriage flaky tests\nReview pull requests for testability",
    requirements:
      "Experience with Playwright or Cypress\nBasic CI knowledge\nAttention to detail",
    applicants: 8,
    createdAt: isoDaysAgo(12),
  },
];

export default async function ManageJobsPage() {
  await requireRole("recruiter");

  return (
    <div className="min-h-screen bg-[#090A0C] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[#22252A] pb-6">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
              Manage Jobs <span className="text-gray-600">›</span>
              <span className="text-gray-400">Job Listings &amp; Postings</span>
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">Manage Job Posts</h1>

            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            New Job Post
          </Link>
        </div>

        <JobsTable jobs={DUMMY_JOBS} />
      </div>
    </div>
  );
}
