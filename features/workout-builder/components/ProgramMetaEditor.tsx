"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { ProgramGoal } from "@/types/Workout";
import { useState } from "react";
import { Edit3, Target } from "lucide-react";

interface ProgramMetaEditorProps {
  name: string;
  description: string;
  goal: ProgramGoal;
  onChange: (
    fields: Partial<{ name: string; description: string; goal: ProgramGoal }>
  ) => void;
}

export const ProgramMetaEditor: React.FC<ProgramMetaEditorProps> = ({
  name,
  description,
  goal,
  onChange,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleNameSubmit = () => {
    onChange({ name: tempName });
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    } else if (e.key === "Escape") {
      setTempName(name);
      setIsEditingName(false);
    }
  };

  const goalColors = {
    strength: "bg-red-100 text-red-800 border-red-200",
    hypertrophy: "bg-blue-100 text-blue-800 border-blue-200",
    endurance: "bg-green-100 text-green-800 border-green-200",
    power: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div className="flex items-center gap-4 py-2">
      {/* Program Name */}
      <div className="flex items-center gap-2">
        {isEditingName ? (
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleNameKeyDown}
            className="text-xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-1 focus-visible:ring-offset-0"
            autoFocus
          />
        ) : (
          <h1
            className="text-xl font-bold cursor-pointer hover:text-muted-foreground transition-colors"
            onClick={() => setIsEditingName(true)}
          >
            {name || "Untitled Program"}
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          onClick={() => setIsEditingName(true)}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>

      {/* Goal Badge */}
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-muted-foreground" />
        <Select
          value={goal}
          onValueChange={(goal) => onChange({ goal: goal as ProgramGoal })}
        >
          <SelectTrigger className="border-none shadow-none p-0 h-auto focus:ring-0">
            <Badge
              variant="outline"
              className={`${goalColors[goal]} hover:opacity-80 cursor-pointer`}
            >
              {goal
                ? goal.charAt(0).toUpperCase() + goal.slice(1)
                : "Select Goal"}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {["strength", "hypertrophy", "endurance", "power"].map(
              (goalOption) => (
                <SelectItem key={goalOption} value={goalOption}>
                  <Badge
                    variant="outline"
                    className={goalColors[goalOption as ProgramGoal]}
                  >
                    {goalOption.charAt(0).toUpperCase() + goalOption.slice(1)}
                  </Badge>
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Description Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {description ? "Edit Description" : "Add Description"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Program Description</h4>
            <Textarea
              value={description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Describe your program goals, structure, or notes..."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Add details about your program to help track your progress.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
