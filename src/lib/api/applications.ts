import type { ApplicationRecord, ApplicationStatus } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

/** One row of the sample data below. */
type SampleRow = {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobType: string;
  category: string;
  isRemote: boolean;
  location: string;
  status: ApplicationStatus;
  /** How long ago the sample application was made, in hours. */
  hoursAgo: number;
};

/**
 * Sample applications shown while the backend has no GET /applications yet.
 * Job ids point at real jobs in the catalog, so "Details" links work.
 *
 * TODO: delete this array and the fallback in getApplications() once the
 * endpoint exists — real data will then take over automatically.
 */
const SAMPLE_APPLICATIONS: SampleRow[] = [
  { jobId: "6af192f2770bcfcbc29170ca", jobTitle: "Frontend Developer", companyName: "HirePulse Network", jobType: "Full-time", category: "Engineering", isRemote: true, location: "New York, USA", status: "Applied", hoursAgo: 2 },
  { jobId: "6af192f2770bcfcbc29170cb", jobTitle: "Senior Product Designer", companyName: "Craftlane Digital", jobType: "Full-time", category: "Design", isRemote: false, location: "London, UK (Hybrid)", status: "Review", hoursAgo: 26 },
  { jobId: "6af1ca039a7c23365467e612", jobTitle: "Frontend Developer", companyName: "HirePulse Network", jobType: "Full-time", category: "Engineering", isRemote: true, location: "New York, USA", status: "Shortlisted", hoursAgo: 96 },
  { jobId: "6af1ca039a7c23365467e613", jobTitle: "Backend Developer", companyName: "TechNova Solutions", jobType: "Full-time", category: "Engineering", isRemote: false, location: "Dhaka, Bangladesh", status: "Rejected", hoursAgo: 168 },
  { jobId: "6af1ca039a7c23365467e614", jobTitle: "UI/UX Designer", companyName: "Creative Minds Studio", jobType: "Part-time", category: "Design", isRemote: true, location: "London, UK", status: "Applied", hoursAgo: 5 },
  { jobId: "6af1ca039a7c23365467e615", jobTitle: "Digital Marketing Executive", companyName: "Growthify Media", jobType: "Full-time", category: "Marketing", isRemote: false, location: "Chattogram, Bangladesh", status: "Offered", hoursAgo: 336 },
  { jobId: "6af1cae06aa092d6068ae675", jobTitle: "Full Stack Developer", companyName: "NextGen Technologies", jobType: "Full-time", category: "Engineering", isRemote: true, location: "Toronto, Canada", status: "Applied", hoursAgo: 12 },
  { jobId: "6af1cae06aa092d6068ae676", jobTitle: "React Developer", companyName: "PixelSoft Studio", jobType: "Contract", category: "Engineering", isRemote: true, location: "Remote", status: "Shortlisted", hoursAgo: 50 },
  { jobId: "6af1cae06aa092d6068ae677", jobTitle: "Product Manager", companyName: "InnovateX", jobType: "Full-time", category: "Management", isRemote: false, location: "New York, USA", status: "Review", hoursAgo: 72 },
  { jobId: "6af1cae06aa092d6068ae678", jobTitle: "Graphic Designer", companyName: "DesignHub Creative", jobType: "Part-time", category: "Design", isRemote: true, location: "Remote", status: "Rejected", hoursAgo: 240 },
  { jobId: "6af1cae06aa092d6068ae679", jobTitle: "Data Analyst", companyName: "DataSphere Analytics", jobType: "Full-time", category: "Data & Analytics", isRemote: false, location: "Singapore", status: "Interview", hoursAgo: 190 },
  { jobId: "6af1cae06aa092d6068ae67a", jobTitle: "Mobile App Developer", companyName: "AppWorks Technologies", jobType: "Full-time", category: "Engineering", isRemote: true, location: "Berlin, Germany", status: "Applied", hoursAgo: 1 },
  { jobId: "6af1cae06aa092d6068ae67b", jobTitle: "SEO Specialist", companyName: "MarketBoost Agency", jobType: "Full-time", category: "Marketing", isRemote: true, location: "Sydney, Australia", status: "Shortlisted", hoursAgo: 120 },
  { jobId: "6af1cae06aa092d6068ae67c", jobTitle: "Customer Support Executive", companyName: "CloudConnect", jobType: "Full-time", category: "Customer Support", isRemote: false, location: "Dhaka, Bangladesh", status: "Offered", hoursAgo: 480 },
  { jobId: "6af1cae06aa092d6068ae67d", jobTitle: "DevOps Engineer", companyName: "CloudStack Solutions", jobType: "Full-time", category: "Engineering", isRemote: true, location: "Amsterdam, Netherlands", status: "Rejected", hoursAgo: 400 },
  { jobId: "6af1cae06aa092d6068ae67e", jobTitle: "Content Writer", companyName: "StoryLine Media", jobType: "Internship", category: "Content & Writing", isRemote: true, location: "Remote", status: "Interview", hoursAgo: 260 },
];

/**
 * All applications for one seeker — feeds the "My Applications" page.
 * Falls back to sample data when the endpoint is missing or errors, so the
 * page always has something to render instead of crashing.
 */
export const getApplications = async (userId: string): Promise<ApplicationRecord[]> => {
    try {
        const res = await fetch(`${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`);
        if (res.ok) return res.json();
    } catch {
        // Endpoint unreachable — fall through to the sample data below.
    }

    return SAMPLE_APPLICATIONS.map(({ hoursAgo, ...row }, index) => ({
        _id: `sample-${index + 1}`,
        userId,
        email: "",
        appliedAt: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
        ...row,
    }));
}
