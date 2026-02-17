"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SortKey } from "@/features/workout-builder/hooks/useExerciseLibrary";
import { cn } from "@/lib/utils";
import { Check, SortAsc } from "lucide-react";

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Best match" },
  { key: "alpha", label: "A → Z" },
  { key: "fatigue_desc", label: "Fatigue (High → Low)" },
  { key: "fatigue_asc", label: "Fatigue (Low → High)" },
  { key: "cns_desc", label: "CNS Demand (High → Low)" },
  { key: "metabolic_desc", label: "Metabolic (High → Low)" },
  { key: "joint_desc", label: "Joint Stress (High → Low)" },
];

export function SortPopover({
  sortKey,
  setSortKey,
}: {
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
}) {
  const currentLabel = OPTIONS.find((o) => o.key === sortKey)?.label ?? "Sort";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SortAsc className="w-3 h-3" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1 text-sm">
        <div className="flex flex-col">
          {OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-between",
                sortKey === opt.key && "bg-muted"
              )}
              onClick={() => setSortKey(opt.key)}
            >
              {opt.label}
              {sortKey === opt.key && <Check className="w-4 h-4" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
