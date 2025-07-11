"use client";

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
import type { Program, ProgramDay } from "@/types/Workout";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ClearWorkoutDayModal } from "./ClearWorkoutDayModal";
import { DayNameEditor } from "./DayNameEditor";

interface DayHeaderProps {
  program: Program;
  activeBlockIndex: number;
  activeDayIndex: number;
  editedName: string;
  setEditedName: (name: string) => void;
  isEditingName: boolean;
  setIsEditingName: (value: boolean) => void;
  updateDayDetails: (updates: Partial<ProgramDay>) => void;
  exerciseCount: number;
  setCollapsedIndex: (index: number | null) => void;
  collapsedIndex: number | null;
  clearWorkout: () => void;
}

export const DayHeader = ({
  program,
  activeBlockIndex,
  activeDayIndex,
  editedName,
  setEditedName,
  isEditingName,
  setIsEditingName,
  updateDayDetails,
  exerciseCount,
  setCollapsedIndex,
  collapsedIndex,
  clearWorkout,
}: DayHeaderProps) => {
  const day =
    program.mode === "blocks"
      ? program.blocks?.[activeBlockIndex]?.days?.[activeDayIndex] ?? null
      : program.days?.[activeDayIndex] ?? null;

  const [localDescription, setLocalDescription] = useState(
    day?.description || ""
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLocalDescription(day?.description || "");
  }, [activeDayIndex, activeBlockIndex, program.mode]);

  const handleDescriptionSave = () => {
    updateDayDetails({ description: localDescription.trim() });
  };

  const isCollapsed = collapsedIndex === -1;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b transition-all duration-200",
        scrolled && "bg-background/95 shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
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

            <Badge variant="secondary" className="shrink-0 text-xs font-medium">
              {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
            </Badge>

            {day?.description && (
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <NotesPopover
              value={day?.description || ""}
              title="Work Day Notes"
              onSave={handleDescriptionSave}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsedIndex(isCollapsed ? null : -1)}
              className="hidden sm:flex items-center gap-2"
            >
              {isCollapsed ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="sm:hidden">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setCollapsedIndex(isCollapsed ? null : -1)}
                >
                  {isCollapsed ? (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Expand All
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Collapse All
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  {day?.description ? "Edit Notes" : "Add Notes"}
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

            <div className="hidden sm:block">
              <ClearWorkoutDayModal onConfirm={clearWorkout} />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
