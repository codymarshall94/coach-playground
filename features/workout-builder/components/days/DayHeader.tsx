"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Program, ProgramDay } from "@/types/Workout";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
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
      setScrolled(window.scrollY > 10);
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

  return (
    <motion.div
      key={`day-header-${activeBlockIndex}-${activeDayIndex}`}
      initial={{ opacity: 0, y: -5 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: scrolled ? 1.02 : 1,
      }}
      transition={{
        duration: 0.2,
        scale: { duration: 0.3, ease: "easeOut" },
      }}
      className={cn(
        "sticky top-0 z-20 flex py-6 flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6 pb-3 mb-4 border-b w-full transition-all duration-300 ease-out",
        // Base styles
        "bg-background/70 backdrop-blur-sm border-border/50",
        // Scrolled styles - much more prominent
        scrolled && [
          "bg-background/95 backdrop-blur-xl",
          "shadow-2xl shadow-black/20",
          "border-border",
          "ring-1 ring-border/20",
          // Optional: slight tint when scrolled
          "bg-gradient-to-r from-background/95 to-background/90",
        ]
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="flex items-center gap-2">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <FileText
                className={cn(
                  "w-4 h-4 text-muted-foreground hover:text-foreground",
                  day?.description && "text-primary"
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-4 border border-border bg-background rounded-lg shadow-md"
            align="start"
          >
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <h4 className="font-medium text-sm text-muted-foreground">
                Day Notes
              </h4>
              <Textarea
                rows={3}
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                placeholder="E.g. Focus on glutes, light accessories..."
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDescriptionSave}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full px-3 py-1 text-xs transition-all duration-300",
            scrolled && "bg-primary/10 text-primary border-primary/20"
          )}
        >
          {exerciseCount} {exerciseCount === 1 ? "Exercise" : "Exercises"}
        </Badge>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCollapsedIndex(collapsedIndex === -1 ? null : -1)}
            className={cn(
              "transition-all duration-300",
              scrolled && "bg-primary/5 border-primary/30 hover:bg-primary/10"
            )}
          >
            {collapsedIndex === -1 ? (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Expand All
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse All
              </>
            )}
          </Button>
        </div>

        <ClearWorkoutDayModal onConfirm={clearWorkout} />
      </div>
    </motion.div>
  );
};
