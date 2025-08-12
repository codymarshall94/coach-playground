"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { NotesPopover } from "@/components/NotesPopover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Program, ProgramDay, WorkoutExerciseGroup } from "@/types/Workout";
import { WorkoutAnalyticsSummary } from "@/utils/analyzeWorkoutDay";
import { WorkoutAnalyticsPanel } from "../insights/WorkoutAnalyticsPanel";
import { DayNameEditor } from "./DayNameEditor";

interface DayHeaderProps {
  day?: ProgramDay;
  program: Program;
  activeBlockIndex: number;
  activeDayIndex: number;
  exerciseCount: number;
  clearWorkout: () => void;
  updateDayDetails: (dayDetails: Partial<ProgramDay>) => void;
  collapsedIndex: number | null;
  setCollapsedIndex: (index: number | null) => void;
  isWorkoutDay: boolean;
  exerciseGroups: WorkoutExerciseGroup[];
  insights: WorkoutAnalyticsSummary;
  analyticsOpen: boolean;
  setAnalyticsOpen: (open: boolean) => void;
}

export function DayHeader({
  day,
  program,
  activeBlockIndex,
  activeDayIndex,
  exerciseCount,
  clearWorkout,
  updateDayDetails,
  collapsedIndex,
  setCollapsedIndex,
  isWorkoutDay,
  exerciseGroups,
  insights,
  analyticsOpen,
  setAnalyticsOpen,
}: DayHeaderProps) {
  const [editedName, setEditedName] = useState(day?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    setEditedName(day?.name || "");
  }, [day?.name]);

  const handleDescriptionSave = (description: string) => {
    updateDayDetails({ description });
  };

  const isCollapsed = collapsedIndex === -1;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-20  backdrop-blur-md border-b transition-all duration-200 mb-4"
      )}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Main header row */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <DayNameEditor
              program={program}
              activeBlockIndex={activeBlockIndex}
              activeDayIndex={activeDayIndex}
              editedName={editedName}
              setEditedName={setEditedName}
              updateDayDetails={updateDayDetails}
              isEditingName={isEditingName}
              setIsEditingName={setIsEditingName}
            />

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {exerciseCount}
              </Badge>
              {day?.description && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </div>
          </div>

          {isWorkoutDay && exerciseGroups.length > 0 && (
            <div className="flex justify-between items-center mt-2 mb-2 px-1">
              <div className="flex gap-2">
                <WorkoutAnalyticsPanel
                  workout={exerciseGroups}
                  summary={insights!}
                  open={analyticsOpen}
                  setOpen={setAnalyticsOpen}
                />
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollapsedIndex(isCollapsed ? null : -1)}
            className="flex items-center gap-2 min-w-fit"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="hidden sm:inline">Show</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="hidden sm:inline">Hide</span>
              </>
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
    </motion.header>
  );
}
