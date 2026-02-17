"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SetType } from "@/types/Workout";
import {
  Clock,
  Layers,
  Repeat,
  Target,
  TrendingDown,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

export const SET_TYPE_CONFIG: Record<
  SetType,
  {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: "Basic" | "Advanced" | "Intensity";
    colorClass: string;
    short: string;
    other?: boolean;
  }
> = {
  warmup: {
    label: "Warmup",
    description: "Light set to prepare for the main set",
    icon: Target,
    category: "Basic",
    colorClass: "bg-set-type-warmup/10 text-set-type-warmup",
    short: "W",
  },
  standard: {
    label: "Standard",
    description: "Traditional straight set with consistent reps and rest",
    icon: Target,
    category: "Basic",
    colorClass: "bg-set-type-standard/10 text-set-type-standard",
    short: "S",
    other: true,
  },
  amrap: {
    label: "AMRAP",
    description: "As many reps as possible to assess progress and fatigue",
    icon: Zap,
    category: "Intensity",
    colorClass: "bg-set-type-amrap/10 text-set-type-amrap",
    short: "AM",
  },
  drop: {
    label: "Drop Set",
    description: "Sequential sets with reduced weight and minimal rest",
    icon: TrendingDown,
    category: "Advanced",
    colorClass: "bg-set-type-drop/10 text-set-type-drop",
    short: "D",
  },
  cluster: {
    label: "Cluster",
    description: "Subdivided sets with short intra-rest for power and form",
    icon: Layers,
    category: "Advanced",
    colorClass: "bg-set-type-cluster/10 text-set-type-cluster",
    short: "C",
  },
  myo_reps: {
    label: "Myo-Reps",
    description:
      "Activation set followed by short-rest mini-sets for hypertrophy",
    icon: Repeat,
    category: "Advanced",
    colorClass: "bg-set-type-myo_reps/10 text-set-type-myo_reps",
    short: "M",
  },
  rest_pause: {
    label: "Rest-Pause",
    description: "Heavy set broken by short pauses to maintain intensity",
    icon: Clock,
    category: "Intensity",
    colorClass: "bg-set-type-rest_pause/10 text-set-type-rest_pause",
    short: "RP",
  },
  top_set: {
    label: "Top Set",
    description: "The heaviest working set in a session",
    icon: Target,
    category: "Intensity",
    colorClass: "bg-set-type-top_set/10 text-set-type-top_set",
    short: "TS",
  },
  backoff: {
    label: "Backoff",
    description: "Light set to recover from the main set",
    icon: Target,
    category: "Basic",
    colorClass: "bg-set-type-backoff/10 text-set-type-backoff",
    short: "B",
  },
};

interface SetTypeSelectorProps {
  setType: SetType;
  onSetTypeChange: (setType: SetType) => void;
  /** Render as a flat table cell — fills entire cell, no rounded edges */
  cellMode?: boolean;
}

export function SetTypeSelector({
  setType,
  onSetTypeChange,
  cellMode = false,
}: SetTypeSelectorProps) {
  const [open, setOpen] = useState(false);

  const groupedSetTypes = useMemo(() => {
    const groups: Record<
      string,
      Array<[string, (typeof SET_TYPE_CONFIG)[SetType]]>
    > = {};

    Object.entries(SET_TYPE_CONFIG).forEach(([key, config]) => {
      if (!groups[config.category]) {
        groups[config.category] = [];
      }
      groups[config.category].push([key, config]);
    });

    return groups;
  }, []);

  const handleSelect = (key: SetType) => {
    onSetTypeChange(key);
    setOpen(false);
  };

  const currentConfig = SET_TYPE_CONFIG[setType];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {cellMode ? (
          <button
            className={cn(
              "w-full h-full px-1.5 py-0.5 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors hover:bg-muted/40",
              SET_TYPE_CONFIG[setType].colorClass
            )}
          >
            <span className="font-bold">{SET_TYPE_CONFIG[setType].short}</span>
            <span className="truncate">{SET_TYPE_CONFIG[setType].label}</span>
          </button>
        ) : (
          <Badge
            variant="outline"
            className={cn(
              "w-8 h-8 text-xs font-bold flex items-center justify-center cursor-pointer",
              SET_TYPE_CONFIG[setType].colorClass
            )}
          >
            {SET_TYPE_CONFIG[setType].short}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
          {Object.entries(groupedSetTypes).map(([category, setTypes]) => (
            <div key={category}>
              {setTypes.map(([key, config]) => {
                const isSelected = key === setType;

                return (
                  <button
                    key={key}
                    className={cn(
                      "w-full text-left px-4 py-3 cursor-pointer transition-colors",
                      "hover:bg-muted/40 focus:bg-muted/40 focus:outline-none",
                      isSelected && "bg-muted/30"
                    )}
                    onClick={() => handleSelect(key as SetType)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(key as SetType);
                      }
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="font-semibold text-sm text-foreground">
                      {config.label}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {config.description}
                    </p>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
