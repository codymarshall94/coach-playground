"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { NotesPopover } from "@/components/NotesPopover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DayMetrics } from "@/engines/core/types";
import { cn } from "@/lib/utils";
import { Program, ProgramDay, WorkoutExerciseGroup } from "@/types/Workout";
import { estimateWorkoutDuration } from "@/utils/volume/estimateExerciseDuration";
import InlineNameEditor from "../InlineNameEditor";
import { ETLDisplay } from "../insights/EtlDisplay";
import { WorkoutAnalyticsPanel } from "../insights/WorkoutAnalyticsPanel";

interface DayHeaderProps {
  day?: ProgramDay;
  program: Program;
  activeBlockIndex: number | null;
  activeDayIndex: number | null;
  clearWorkout: () => void;
  updateDayDetails: (dayDetails: Partial<ProgramDay>) => void;
  collapsedIndex: number | null;
  setCollapsedIndex: (index: number | null) => void;
  isWorkoutDay: boolean;
  exerciseGroups: WorkoutExerciseGroup[];
  analyticsOpen: boolean;
  setAnalyticsOpen: (open: boolean) => void;
  dayMetrics: DayMetrics;
}

export function DayHeader({
  day,
  program,
  activeBlockIndex,
  activeDayIndex,
  clearWorkout,
  updateDayDetails,
  collapsedIndex,
  setCollapsedIndex,
  isWorkoutDay,
  exerciseGroups,
  analyticsOpen,
  setAnalyticsOpen,
  dayMetrics,
}: DayHeaderProps) {
  const [editedName, setEditedName] = useState(day?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    setEditedName(day?.name || "");
  }, [day?.name]);

  const handleSave = (next: string) => {
    const trimmed = next.trim();
    if (trimmed) updateDayDetails({ name: trimmed });
    setEditedName(trimmed);
    setIsEditingName(false);
  };

  const handleDescriptionSave = (description: string) => {
    updateDayDetails({ description });
  };

  const isCollapsed = collapsedIndex === -1;

  const durationMin = Math.ceil(
    estimateWorkoutDuration(
      exerciseGroups.flatMap((group) => group.exercises)
    ) / 60
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-20 backdrop-blur-md border-b transition-all duration-200 mb-4"
      )}
    >
      <div className="container mx-auto px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <InlineNameEditor
              name={
                program.mode === "blocks"
                  ? program.blocks?.[activeBlockIndex ?? 0]?.days?.[
                      activeDayIndex ?? 0
                    ]?.name || "Untitled Day"
                  : program.days?.[activeDayIndex ?? 0]?.name || "Untitled Day"
              }
              onSave={(next) => updateDayDetails({ name: next })}
              placeholder="Day name"
              size="lg"
            />
          </div>

          <div className="flex items-center gap-3 text-meta">
            <ETLDisplay normalizedETL={dayMetrics.sessionLoad} />
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="type-num">{durationMin}</span> min
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isWorkoutDay && exerciseGroups.length > 0 && (
              <WorkoutAnalyticsPanel
                workout={exerciseGroups}
                dayMetrics={dayMetrics}
                open={analyticsOpen}
                setOpen={setAnalyticsOpen}
              />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsedIndex(isCollapsed ? null : -1)}
              className="flex items-center gap-1 type-secondary"
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <NotesPopover
                    value={day?.description || ""}
                    title="Day Notes"
                    onSave={handleDescriptionSave}
                  />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={clearWorkout}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Day
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
