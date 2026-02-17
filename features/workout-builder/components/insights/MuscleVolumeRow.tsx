import { Badge } from "@/components/ui/badge";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/Exercise";
import type { WorkoutExercise } from "@/types/Workout";
import { useMemo } from "react";

interface MuscleVolumeRowProps {
  index: number;
  muscleId: string;
  setCount: number; // raw (total) sets for this muscle
  weightedVolume: number; // muscle-adjusted sets for this muscle
  maxVolume: number; // max muscle-adjusted across muscles
  maxRaw: number; // max raw across muscles
  totalWeighted: number; // sum of all muscle-adjusted sets (for % of day)
  workout: WorkoutExercise[];
  exercises: Exercise[];
  className?: string;
  onClickMuscle?: (muscleId: string) => void;
}

const countExercisesForMuscle = (
  workout: WorkoutExercise[],
  exercises: Exercise[],
  muscleId: string
) => {
  const ids = new Set(
    workout
      .map((w) => {
        const meta = exercises.find((e) => e.id === w.exercise_id);
        const hits = meta?.exercise_muscles?.some(
          (m) => m.muscles.id === muscleId
        );
        return hits ? w.exercise_id : null;
      })
      .filter(Boolean)
  );
  return ids.size;
};

const fmt1 = (n: number) => {
  const x = Number(n.toFixed(1));
  return Number.isInteger(x) ? String(x) : String(x);
};

export function MuscleVolumeRow({
  index,
  muscleId,
  setCount,
  weightedVolume,
  maxVolume,
  maxRaw,
  totalWeighted,
  workout,
  exercises,
  className,
  onClickMuscle,
}: MuscleVolumeRowProps) {
  const displayName =
    MUSCLE_DISPLAY_MAP[muscleId as keyof typeof MUSCLE_DISPLAY_MAP] ??
    muscleId.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Normalize bars
  const effPct =
    maxVolume > 0
      ? Math.max(
          2,
          Math.min(100, Math.round((weightedVolume / maxVolume) * 100))
        )
      : 0;
  const rawPct =
    maxRaw > 0
      ? Math.max(2, Math.min(100, Math.round((setCount / maxRaw) * 100)))
      : 0;

  const shareOfDay =
    totalWeighted > 0 ? Math.round((weightedVolume / totalWeighted) * 100) : 0;

  const exerciseCount = useMemo(
    () => countExercisesForMuscle(workout, exercises, muscleId),
    [workout, exercises, muscleId]
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Badge className="bg-muted text-muted-foreground rounded-full px-2.5">
          {index + 1}
        </Badge>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onClickMuscle?.(muscleId)}
              className="truncate text-sm font-medium text-foreground hover:underline"
              title={displayName}
            >
              {displayName}
            </button>
            {shareOfDay > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                {shareOfDay}% of today
              </span>
            )}
          </div>

          <div className="space-y-1 mt-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${effPct}%`,
                  backgroundColor: "rgba(59,130,246,0.75)", // blue-500ish
                }}
              />
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${rawPct}%`,
                  backgroundColor: "rgba(59,130,246,0.25)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-foreground">
            {fmt1(weightedVolume)} sets
          </div>
          <div className="text-[11px] text-muted-foreground">
            {setCount} total • {exerciseCount}{" "}
            {exerciseCount === 1 ? "exercise" : "exercises"}
          </div>
        </div>
      </div>
    </div>
  );
}
