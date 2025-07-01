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

  return (
    <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b w-full">
      {/* Left side: Name and Exercise count */}
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
                day.description
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              <FileText
                className={cn(
                  "h-3 w-3 mr-1",
                  day.description && "text-blue-500"
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Day Description</h4>
              <div className="space-y-2">
                <Textarea
                  rows={3}
                  value={day.description || ""}
                  onChange={(e) =>
                    updateDayDetails({ description: e.target.value })
                  }
                  placeholder="E.g. Focus on glutes, light accessories..."
                  className="resize-none"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
