import {
  Briefcase,
  Cloud,
  Code,
  Layers,
  Megaphone,
  PenTool,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/**
 * Category (dept) accent: color + icon.
 * Kept out of `components/job-ui.tsx` (a client module) so Server Components
 * can use it too.
 */
const categoryStyles: Record<string, { text: string; icon: LucideIcon }> = {
  "Engineering & Tech": { text: "text-sky-400", icon: Code },
  "Design & Creative": { text: "text-orange-400", icon: PenTool },
  "Product Management": { text: "text-violet-400", icon: Layers },
  "Marketing & Sales": { text: "text-purple-400", icon: Megaphone },
  // Labels used by the Figma dummy rows
  Engineering: { text: "text-sky-400", icon: Code },
  Design: { text: "text-orange-400", icon: PenTool },
  Infrastructure: { text: "text-sky-400", icon: Cloud },
  Marketing: { text: "text-purple-400", icon: Megaphone },
  Quality: { text: "text-violet-400", icon: ShieldCheck },
};

const defaultCategoryStyle = { text: "text-indigo-400", icon: Briefcase };

/** Accent color/icon for a job category (falls back to a neutral style). */
export function getCategoryStyle(category: string) {
  return categoryStyles[category] ?? defaultCategoryStyle;
}
