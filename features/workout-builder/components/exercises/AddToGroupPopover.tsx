import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Exercise } from "@/types/Exercise";
import { WorkoutExercise } from "@/types/Workout";
import { useMemo, useState } from "react";

interface AddToGroupPopoverProps {
  trigger: React.ReactNode;
  onSelect: (exercise: Exercise, cloneFrom?: WorkoutExercise) => void;
  groupIndex: number;
  existingExercises: WorkoutExercise[];
  allExercises: Exercise[];
  suggestedExercises?: Exercise[];
}

export function AddToGroupPopover({
  trigger,
  onSelect,
  groupIndex,
  existingExercises,
  allExercises,
  suggestedExercises = [],
}: AddToGroupPopoverProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const reused = useMemo(() => {
    return existingExercises.filter(
      (ex) => !allExercises.some((e) => e.id === ex.exercise_id)
    );
  }, [existingExercises, allExercises]);

  const filteredLibrary = useMemo(() => {
    if (!searchTerm) return allExercises;
    return allExercises.filter((ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allExercises]);

  const handleSelect = (exercise: Exercise, cloneFrom?: WorkoutExercise) => {
    onSelect(exercise, cloneFrom);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[350px] p-4 space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            From This Workout Day
          </div>
          {existingExercises.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No other exercises available
            </div>
          ) : (
            <ScrollArea className="max-h-[120px] space-y-1">
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
                  className="w-full text-left text-sm hover:bg-muted rounded px-2 py-1"
                >
                  {ex.name}{" "}
                  <span className="text-xs text-muted-foreground">(Clone)</span>
                </button>
              ))}
            </ScrollArea>
          )}
        </div>

        {suggestedExercises.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Smart Suggestions
            </div>
            <ScrollArea className="max-h-[120px] space-y-1">
              {suggestedExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelect(ex)}
                  className="w-full text-left text-sm hover:bg-muted rounded px-2 py-1"
                >
                  {ex.name}
                </button>
              ))}
            </ScrollArea>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Search
          </div>
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm"
          />
          <ScrollArea className="max-h-[150px] space-y-1">
            {filteredLibrary.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSelect(ex)}
                className="w-full text-left text-sm hover:bg-muted rounded px-2 py-1"
              >
                {ex.name}
              </button>
            ))}
          </ScrollArea>
        </div>

        <div className="pt-2">
          <Button
            variant="ghost"
            className="w-full text-muted-foreground text-xs"
            onClick={() => {
              setOpen(false);
              // optional: open full-screen library modal instead
            }}
          >
            📚 Open Full Library
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
