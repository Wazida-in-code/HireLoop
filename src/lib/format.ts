/**
 * Salary formatting shared by every view that shows a job's pay
 * (manage-jobs table, browse-jobs cards, …).
 */

import type { JobRecord } from "@/lib/types";

/** Short form of a salary figure: 143000 → "143k", 45 → "45". */
function toAmount(value: string): string | null {
  const n = Number(value);
  if (!value.trim() || Number.isNaN(n)) return null;
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}

function unitFor(salaryType: string): string {
  switch (salaryType) {
    case "Per hour":
      return "/ hr";
    case "Per month":
      return "/ mo";
    case "Per year":
      return "/ yr";
    default:
      return "";
  }
}

/** Whether a job has at least one usable salary figure. */
export function hasSalary(job: JobRecord): boolean {
  return Boolean(Number(job.minSalary) || Number(job.maxSalary));
}

/** "€143k – 185k / yr" for a job, or "Not specified" when it has no salary. */
export function formatSalary(job: JobRecord): string {
  const min = toAmount(job.minSalary);
  const max = toAmount(job.maxSalary);

  if (!min && !max) return "Not specified";

  const range = [min, max]
    .filter(Boolean)
    .map((amount) => `€${amount}`)
    .join(" – ");
  const unit = unitFor(job.salaryType);

  return unit ? `${range} ${unit}` : range;
}
