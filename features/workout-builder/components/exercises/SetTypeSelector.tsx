"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Search,
  Zap,
  Target,
  TrendingDown,
  Layers,
  Repeat,
  Clock,
} from "lucide-react";
import { useState, useMemo } from "react";

export type SetType =
  | "standard"
  | "amrap"
  | "drop"
  | "cluster"
  | "myo_reps"
  | "rest_pause";

export const SET_TYPE_CONFIG: Record<
  SetType,
  {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: "Basic" | "Advanced" | "Intensity";
    difficulty: 1 | 2 | 3;
    tags: string[];
  }
> = {
  standard: {
    label: "Standard",
    description: "Traditional straight set with consistent reps and rest",
    icon: Target,
    category: "Basic",
    difficulty: 1,
    tags: ["beginner", "traditional", "simple"],
  },
  amrap: {
    label: "AMRAP",
    description: "As many reps as possible to assess progress and fatigue",
    icon: Zap,
    category: "Intensity",
    difficulty: 2,
    tags: ["intensity", "failure", "assessment"],
  },
  drop: {
    label: "Drop Set",
    description: "Sequential sets with reduced weight and minimal rest",
    icon: TrendingDown,
    category: "Advanced",
    difficulty: 3,
    tags: ["advanced", "fatigue", "volume"],
  },
  cluster: {
    label: "Cluster",
    description: "Subdivided sets with short intra-rest for power and form",
    icon: Layers,
    category: "Advanced",
    difficulty: 3,
    tags: ["power", "technique", "advanced"],
  },
  myo_reps: {
    label: "Myo-Reps",
    description:
      "Activation set followed by short-rest mini-sets for hypertrophy",
    icon: Repeat,
    category: "Advanced",
    difficulty: 2,
    tags: ["hypertrophy", "efficiency", "volume"],
  },
  rest_pause: {
    label: "Rest-Pause",
    description: "Heavy set broken by short pauses to maintain intensity",
    icon: Clock,
    category: "Intensity",
    difficulty: 3,
    tags: ["intensity", "heavy", "compact"],
  },
};

const DIFFICULTY_COLORS = {
  1: "bg-green-100 text-green-700 border-green-200",
  2: "bg-yellow-100 text-yellow-700 border-yellow-200",
  3: "bg-red-100 text-red-700 border-red-200",
};

const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

interface SetTypeSelectorProps {
  setType: SetType;
  onSetTypeChange: (setType: SetType) => void;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export function SetTypeSelector({
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
  const CurrentIcon = currentConfig?.icon || Target;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            className="w-fit min-w-24 text-xs gap-2 h-8 bg-transparent"
            disabled={disabled}
          >
            <CurrentIcon className="w-3 h-3" />
            {currentConfig?.label || "Standard"}
          </Button>
        )}
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
            {currentConfig?.category} •{" "}
            {DIFFICULTY_LABELS[currentConfig?.difficulty]}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
