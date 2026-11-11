"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "salary-desc", label: "Salary: High to Low" },
  { value: "salary-asc", label: "Salary: Low to High" },
] as const;

export default function SortBy() {
  const [sort, setSort] = useState<string>("recent");

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">Sort by</span>

      <Select
        items={SORT_OPTIONS}
        value={sort}
        onValueChange={(value) => {
          if (value === null) return;
          setSort(value);
          // TODO: write the sort order into the search query (?sort=…).
        }}
      >
        <SelectTrigger
          aria-label="Sort jobs by"
          className="h-9 border-[#22252A] bg-[#121316] text-sm text-gray-200 hover:bg-[#1A1D22]"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="border border-[#22252A] bg-[#121316] text-gray-100 ring-[#22252A] [--accent:#1A1D22] [--accent-foreground:#F5F5F5]">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
