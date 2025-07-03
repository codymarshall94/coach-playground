"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Program, ProgramDay } from "@/types/Workout";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
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
}: DayHeaderProps) => {
  const day =
    program.mode === "blocks"
      ? program.blocks?.[activeBlockIndex]?.days?.[activeDayIndex] ?? null
      : program.days?.[activeDayIndex] ?? null;

  const [localDescription, setLocalDescription] = useState(
    day?.description || ""
  );

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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6 pb-3 mb-4 border-b border-border w-full"
    >
      <div>
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
      </div>

      {/* Right: Notes + exercise count */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="secondary"
          className="rounded-full px-3 py-1 text-xs bg-muted text-muted-foreground border border-border"
        >
          {exerciseCount} {exerciseCount === 1 ? "Exercise" : "Exercises"}
        </Badge>

        <Tooltip>
          <TooltipTrigger asChild>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 px-2 py-1 text-xs border-muted-foreground/20 hover:bg-muted"
                >
                  <FileText
                    className={cn(
                      "w-4 h-4",
                      day?.description && "text-blue-500"
                    )}
                  />
                  <span>{day?.description ? "Edit Notes" : "Add Notes"}</span>
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
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {day?.description ? "Edit Day Notes" : "Add Notes"}
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
};
