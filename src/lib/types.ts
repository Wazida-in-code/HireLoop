/**
 * Shared project types — the single home for every type used across files.
 * Component-local prop types (e.g. a page's `Props`) stay in their own file.
 */

/* ---------- Auth & users ---------- */

/** The three user roles in HireLoop. */
export type Role = "seeker" | "recruiter" | "admin";

/** Which auth form is showing. */
export type AuthMode = "sign-in" | "sign-up";

/** Payload the auth form hands to the page's submit handler. */
export type AuthFormData = {
  name?: string;
  email: string;
  password: string;
  role?: Role;
};

/* ---------- Jobs ---------- */

/** The 13 fields a job post is created with (job form → POST /jobs). */
export type JobDataType = {
  title: string;
  company: string;
  category: string;
  jobType: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  minSalary: string;
  maxSalary: string;
  salaryType: string;
  description: string;
  responsibilities: string;
  requirements: string;
};

/** A job row as rendered by the jobs table (matches the GET /jobs API shape). */
export type JobRecord = JobDataType & {
  _id: string;
  createdAt?: string;
  applicants?: number;
};

/** One selectable option in the browse-jobs filter sidebar (with its match count). */
export type FilterOption = {
  /** Value that will identify the choice in the search query. */
  value: string;
  /** Display text — falls back to `value` when omitted. */
  label?: string;
  /** How many of the fetched jobs match this option. */
  count: number;
};
