import { Button } from "@/components/ui/button";
import { WorkoutExercise } from "@/types/Workout";
import { ChevronDown, Plus } from "lucide-react";
import { ETLDisplay } from "../insights/EtlDisplay";

export function CollapsedExerciseCard({
  order,
  exercise,
  normalizedETL,
  durationMin,
  onExpand,
  showAddToGroup,
  onAddToGroupClick,
}: {
  order: number;
  exercise: WorkoutExercise;
  normalizedETL: number;
  durationMin: number;
  onExpand?: () => void;
  showAddToGroup?: boolean;
  onAddToGroupClick?: () => void;
}) {
  const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);

  return (
    <div
      className="rounded-xl border bg-card hover:bg-card/80 border-border hover:border-primary transition-all p-4 flex items-center justify-between cursor-pointer"
      onClick={onExpand}
    >
      <div className="flex items-center gap-3">
        {showAddToGroup && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onAddToGroupClick?.();
            }}
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}

        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold">
          {order + 1}
        </div>

        <div className="flex flex-col">
          <h4 className="font-medium text-foreground">{exercise.name}</h4>
          <p className="text-xs text-muted-foreground">
            {exercise.sets.length} sets • {totalReps} reps • Est. {durationMin}{" "}
            min
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <ETLDisplay normalizedETL={normalizedETL} />
        <div className="flex items-center gap-1">
          <ChevronDown className="w-3 h-3" />
          <span>Tap to expand</span>
        </div>
      </div>
    </div>
  );
}
