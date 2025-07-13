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
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Info,
  Target,
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
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    borderColor: "border-gray-300",
    description: "Individual exercises with standard rest periods",
    maxExercises: 1,
    icon: User,
  },
  superset: {
    label: "Superset",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    borderColor: "border-blue-500",
    description: "Two exercises performed back-to-back without rest",
    maxExercises: 2,
    icon: Users,
  },
  giant_set: {
    label: "Giant Set",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    borderColor: "border-yellow-500",
    description: "3 exercises for the same muscle group consecutively",
    maxExercises: 3,
    icon: UsersRound,
  },
  circuit: {
    label: "Circuit",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    borderColor: "border-green-500",
    description: "Full-body rotation with minimal rest between exercises",
    maxExercises: 8,
    icon: Zap,
  },
};

interface GroupTypeSelectorProps {
  groupType: WorkoutExerciseGroupType;
  onGroupTypeChange: (groupType: WorkoutExerciseGroupType) => void;
  disabled?: boolean;
  showDetails?: boolean;
}

export function GroupTypeSelector({
  groupType,
  onGroupTypeChange,
  disabled = false,
  showDetails = true,
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
        <motion.div
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          className="inline-block"
        >
          <Badge
            className={cn(
              "cursor-pointer transition-all duration-200 border-0 gap-1.5 px-2.5 py-1",
              currentConfig.color,
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <CurrentIcon className="w-3 h-3" />
            <motion.span
              key={groupType}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="font-medium"
            >
              {currentConfig.label}
            </motion.span>
            {currentConfig.maxExercises > 1 && (
              <span className="text-xs opacity-75">
                ({currentConfig.maxExercises})
              </span>
            )}
          </Badge>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="start">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">
                Choose Exercise Group Type
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Select how you want to structure your exercises
            </p>
          </div>

          <div className="p-2 max-h-80 overflow-y-auto">
            <AnimatePresence mode="wait">
              {Object.entries(GROUP_CONFIG).map(([type, config], index) => {
                const Icon = config.icon;
                const isSelected = groupType === type;

                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-2 last:mb-0"
                  >
                    <motion.button
                      onClick={() =>
                        handleTypeChange(type as WorkoutExerciseGroupType)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, type as WorkoutExerciseGroupType)
                      }
                      className={cn(
                        "w-full text-left p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
                        isSelected
                          ? `${config.borderColor} bg-opacity-20`
                          : "border-transparent hover:border-gray-200 hover:bg-muted/30"
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "p-1.5 rounded-md",
                                isSelected ? config.color : "bg-muted"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm flex items-center gap-2">
                                {config.label}
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1.5 py-0"
                                >
                                  {config.maxExercises}{" "}
                                  {config.maxExercises === 1
                                    ? "exercise"
                                    : "exercises"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {config.description}
                        </p>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="p-3 border-t bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>
                <strong>Current:</strong> {currentConfig.label} • Max{" "}
                {currentConfig.maxExercises} exercise
                {currentConfig.maxExercises !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
