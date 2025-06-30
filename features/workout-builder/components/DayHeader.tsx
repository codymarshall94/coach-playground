"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Program } from "@/types/Workout";
import { FileText } from "lucide-react";
import { DayDescriptionEditor } from "./DayDescriptionEditor";
import { DayNameEditor } from "./DayNameEditor";

interface DayHeaderProps {
  program: Program;
  activeDayIndex: number;
  editedName: string;
  setEditedName: (name: string) => void;
  isEditingName: boolean;
  setIsEditingName: (value: boolean) => void;
  updateDayName: (name: string) => void;
  updateDayDescription: (desc: string) => void;
  exerciseCount: number;
}

export const DayHeader: React.FC<DayHeaderProps> = ({
  program,
  activeDayIndex,
  editedName,
  setEditedName,
  isEditingName,
  setIsEditingName,
  updateDayName,
  updateDayDescription,
  exerciseCount,
}) => {
  const day = program.days[activeDayIndex];

  return (
    <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b w-full">
      {/* Left side: Name and Exercise count */}
      <DayNameEditor
        program={program}
        activeDayIndex={activeDayIndex}
        editedName={editedName}
        setEditedName={setEditedName}
        updateDayName={updateDayName}
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
              <FileText className="h-3 w-3 mr-1" />
              {day.description ? "Edit Note" : "Add Note "}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Day Description</h4>
              <DayDescriptionEditor
                value={day.description || ""}
                onSave={updateDayDescription}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
