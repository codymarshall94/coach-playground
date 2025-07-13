"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SetType } from "@/types/Workout";
import {
  Check,
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

const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

interface SetTypeSelectorProps {
  setIndex: number;
  setType: SetType;
  onSetTypeChange: (setType: SetType) => void;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export function SetTypeSelector({
  setIndex,
  setType,
  onSetTypeChange,
  trigger,
  disabled = false,
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
        <Badge
          variant="outline"
          className={cn(
            "w-8 h-8 text-xs font-bold flex items-center justify-center cursor-pointer",
            SET_TYPE_CONFIG[setType].colorClass
          )}
        >
          <span className="text-xs">{setIndex + 1}.</span>
          {SET_TYPE_CONFIG[setType].short}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedSetTypes).length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No set types found
            </div>
          ) : (
            Object.entries(groupedSetTypes).map(([category, setTypes]) => (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
                  {category}
                </div>
                <div className="p-1">
                  {setTypes.map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = key === setType;

                    return (
                      <div
                        key={key}
                        className={`
                          relative flex items-start gap-3 p-3 rounded-md cursor-pointer transition-all
                          hover:bg-muted/50 focus:bg-muted/50 focus:outline-none
                          ${
                            isSelected
                              ? "bg-primary/5 border border-primary/20"
                              : ""
                          }
                        `}
                        onClick={() => handleSelect(key as SetType)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(key as SetType);
                          }
                        }}
                        tabIndex={0}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div
                          className={`
                          flex items-center justify-center w-8 h-8 rounded-full
                          ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-medium text-sm ${
                                isSelected ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {config.description}
                          </p>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {Object.keys(groupedSetTypes).indexOf(category) <
                  Object.keys(groupedSetTypes).length - 1 && (
                  <Separator className="my-1" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground">
            <strong>Current:</strong> {currentConfig?.label} •{" "}
            {currentConfig?.category}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
