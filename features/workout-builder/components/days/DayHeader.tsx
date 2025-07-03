"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { Program, ProgramDay } from "@/types/Workout";
import { FileText } from "lucide-react";
import { DayNameEditor } from "./DayNameEditor";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useEffect } from "react";

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
      ? program.blocks![activeBlockIndex].days[activeDayIndex] ?? null
      : program.days![activeDayIndex];

  const [localDescription, setLocalDescription] = useState(
    day?.description || ""
  );

  // Sync local description when day changes
  useEffect(() => {
    setLocalDescription(day?.description || "");
  }, [activeDayIndex, activeBlockIndex, program.mode]);

  const handleDescriptionSave = () => {
    updateDayDetails({ description: localDescription.trim() });
  };

  return (
    <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b w-full">
      <DayNameEditor
        {...{
          program,
          activeBlockIndex,
          activeDayIndex,
          editedName,
          setEditedName,
          updateDayDetails,
          isEditingName,
          setIsEditingName,
        }}
      />

      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
        >
          {exerciseCount} {exerciseCount === 1 ? "Exercise" : "Exercises"}
        </Badge>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs ${
                day?.description
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              <FileText
                className={cn(
                  "h-3 w-3 mr-1",
                  day?.description && "text-blue-500"
                )}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Day Description</h4>
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
                  className="text-xs"
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
