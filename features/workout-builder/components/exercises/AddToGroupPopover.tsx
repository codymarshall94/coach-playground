"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Exercise } from "@/types/Exercise";
import type { WorkoutExercise } from "@/types/Workout";
import { Copy, Dumbbell, Library, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ExerciseLibrary } from "./ExerciseLibrary";

interface AddToGroupPopoverProps {
  trigger: React.ReactNode;
  onSelect: (exercise: Exercise, cloneFrom?: WorkoutExercise) => void;
  onAddExerciseToGroup: (groupIndex: number, exercise: Exercise) => void;
  groupIndex: number;
  existingExercises: WorkoutExercise[];
  allExercises: Exercise[];
}

export function AddToGroupPopover({
  trigger,
  onSelect,
  onAddExerciseToGroup,
  groupIndex,
  existingExercises,
  allExercises,
}: AddToGroupPopoverProps) {
  const [open, setOpen] = useState(false);
  const [openLibrary, setOpenLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLibrary = useMemo(() => {
    if (!searchTerm) return allExercises;
    return allExercises.filter((ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allExercises]);

  const handleSelect = (exercise: Exercise, cloneFrom?: WorkoutExercise) => {
    if (cloneFrom) {
      onSelect(exercise, cloneFrom);
    } else {
      onSelect(exercise);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[380px] p-0">
        <div className="p-4 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Add Exercise</h3>
          </div>

          {/* Search Section */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 space-y-4">
              {existingExercises.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      From This Workout
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {existingExercises.length}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {existingExercises.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() =>
                          handleSelect(
                            {
                              id: ex.exercise_id,
                              name: ex.name,
                            } as Exercise,
                            ex
                          )
                        }
                        className="w-full flex items-center justify-between text-left text-sm hover:bg-accent cursor-pointer rounded-md px-3 py-2.5 transition-colors group"
                      >
                        <span className="font-medium">{ex.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results Section */}
              {existingExercises.length > 0 && <Separator />}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Library className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {searchTerm ? `Search Results` : "Exercise Library"}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {filteredLibrary.length}
                  </Badge>
                </div>

                {filteredLibrary.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No exercises found</p>
                    <p className="text-xs">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div className="space-y-1 pb-4">
                    {filteredLibrary.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => onAddExerciseToGroup(groupIndex, ex)}
                        className="w-full flex cursor-pointer items-center gap-3 text-left text-sm hover:bg-accent rounded-md px-3 py-2.5 transition-colors"
                      >
                        <Dumbbell className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{ex.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/20 p-3">
          <ExerciseLibrary
            open={openLibrary}
            setOpen={setOpenLibrary}
            addExercise={handleSelect}
            groupIndex={groupIndex}
            addToGroup={(groupIndex, exercise) => {
              onAddExerciseToGroup(groupIndex, exercise);
              setOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
