"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { WorkoutExerciseGroupType } from "@/types/Workout";
import {
  User,
  Users,
  UsersRound,
  Zap,
} from "lucide-react";
import { useState } from "react";

export const GROUP_CONFIG: Record<
  WorkoutExerciseGroupType,
  {
    label: string;
    color: string;
    borderColor: string;
    description: string;
    maxExercises: number;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  standard: {
    label: "Standard",
    color: "bg-muted text-foreground",
    borderColor: "border-border",
    description: "Individual exercises with standard rest periods",
    maxExercises: 1,
    icon: User,
  },
  superset: {
    label: "Superset",
    color: "bg-accent text-accent-foreground",
    borderColor: "border-accent",
    description: "Two exercises performed back-to-back without rest",
    maxExercises: 2,
    icon: Users,
  },
  giant_set: {
    label: "Giant Set",
    color: "bg-warning/15 text-warning",
    borderColor: "border-warning",
    description: "3 exercises for the same muscle group consecutively",
    maxExercises: 3,
    icon: UsersRound,
  },
  circuit: {
    label: "Circuit",
    color: "bg-positive/15 text-positive",
    borderColor: "border-positive",
    description: "Full-body rotation with minimal rest between exercises",
    maxExercises: 8,
    icon: Zap,
  },
};

interface GroupTypeSelectorProps {
  groupType: WorkoutExerciseGroupType;
  onGroupTypeChange: (groupType: WorkoutExerciseGroupType) => void;
  disabled?: boolean;
}

export function GroupTypeSelector({
  groupType,
  onGroupTypeChange,
  disabled = false,
}: GroupTypeSelectorProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentConfig = GROUP_CONFIG[groupType];
  const CurrentIcon = currentConfig.icon;

  const handleTypeChange = (type: WorkoutExerciseGroupType) => {
    onGroupTypeChange(type);
    setIsPopoverOpen(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    type: WorkoutExerciseGroupType
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTypeChange(type);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Badge
          className={cn(
            "cursor-pointer transition-colors duration-150 border-0 gap-1.5 px-2.5 py-1 mb-2",
            currentConfig.color,
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <CurrentIcon className="w-3 h-3" />
          <span className="font-medium">{currentConfig.label}</span>
          {currentConfig.maxExercises > 1 && (
            <span className="text-xs opacity-75">
              ({currentConfig.maxExercises})
            </span>
          )}
        </Badge>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
          {Object.entries(GROUP_CONFIG).map(([type, config]) => {
            const Icon = config.icon;
            const isSelected = groupType === type;

            return (
              <button
                key={type}
                onClick={() =>
                  handleTypeChange(type as WorkoutExerciseGroupType)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, type as WorkoutExerciseGroupType)
                }
                className={cn(
                  "w-full text-left px-4 py-3 cursor-pointer transition-colors",
                  "hover:bg-muted/40 focus:bg-muted/40 focus:outline-none",
                  isSelected && "bg-muted/30"
                )}
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
      </PopoverContent>
    </Popover>
  );
}
