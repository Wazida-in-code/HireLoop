"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { FilterOption } from "@/lib/types";

type FilterGroupData = {
  name: string;
  options: FilterOption[];
};

type Props = {
  groups: FilterGroupData[];
};

/** Selected values per group — each group allows multiple choices. */
type Selection = Record<string, string[]>;

export default function FiltersPanel({ groups }: Props) {
  const [selection, setSelection] = useState<Selection>({});

  const toggle = (group: string, value: string) => {
    // TODO: write the selection into the search query.
    setSelection((current) => {
      const selected = current[group] ?? [];
      return {
        ...current,
        [group]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  return (
    <aside className="rounded-xl border border-[#22252A] bg-[#121316] p-5 lg:sticky lg:top-20">
      <h2 className="text-lg font-semibold text-white">Filters</h2>

      <div className="mt-5 space-y-6">
        {groups.map((group) => (
          <FilterGroup
            key={group.name}
            group={group}
            selected={selection[group.name] ?? []}
            onToggle={(value) => toggle(group.name, value)}
          />
        ))}
      </div>
    </aside>
  );
}

function FilterGroup({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroupData;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-white">{group.name}</h3>

      <div className="mt-2 space-y-0.5">
        {group.options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm text-gray-300 transition-colors hover:text-white"
          >
            {/* Dark-theme colors: gray unchecked ring, white fill + dark check when checked. */}
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={() => onToggle(option.value)}
              className="[--input:#3F444C] [--primary:#FFFFFF] [--primary-foreground:#090A0C]"
            />
            <span>{option.label ?? option.value}</span>
            <span className="ml-auto text-xs text-gray-500">{option.count}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
