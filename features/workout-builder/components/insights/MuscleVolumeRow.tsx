import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/Exercise";
import type { WorkoutExercise } from "@/types/Workout";
import { Info } from "lucide-react";
import { useMemo } from "react";

interface MuscleVolumeRowProps {
  index: number;
  muscleId: string;
  setCount: number; // raw count of sets that hit this muscle
  weightedVolume: number; // effective sets (your weighting)
  maxVolume: number; // max weightedVolume across all muscles
  workout: WorkoutExercise[];
  exercises: Exercise[];
  className?: string;
  onClickMuscle?: (muscleId: string) => void; // optional for filtering
}

const countExercisesForMuscle = (
  workout: WorkoutExercise[],
  exercises: Exercise[],
  muscleId: string
): number => {
  const ids = new Set(
    workout
      .map((w) => {
        const meta = exercises.find((e) => e.id === w.exercise_id);
        const hits = meta?.exercise_muscles?.find(
          (m) => m.muscles.id === muscleId
        )?.contribution;
        return hits ? w.exercise_id : null;
      })
      .filter(Boolean)
  );
  return ids.size;
};

/** Top contributors for the tooltip (why this muscle is high) */
const topContributors = (
  workout: WorkoutExercise[],
  exercises: Exercise[],
  muscleId: string,
  limit = 3
) => {
  // proxy for contribution = setCount * activation factor
  const rows = workout
    .map((w) => {
      const meta = exercises.find((e) => e.id === w.exercise_id);
      const act =
        meta?.exercise_muscles?.find((m) => m.muscles.id === muscleId)
          ?.contribution ?? 0;
      const sets = w.sets?.length ?? 0;
      return {
        id: w.exercise_id,
        name: w.name,
        score: sets * act,
      };
    })
    .filter((r) => r.score > 0);

  rows.sort((a, b) => b.score - a.score);
  const top = rows.slice(0, limit);
  const total = rows.reduce((s, r) => s + r.score, 0) || 1;
  return top.map((r) => ({ ...r, pct: Math.round((r.score / total) * 100) }));
};

export const MuscleVolumeRow = ({
  index,
  muscleId,
  setCount,
  weightedVolume,
  maxVolume,
  workout,
  exercises,
  className,
  onClickMuscle,
}: MuscleVolumeRowProps) => {
  const displayName =
    MUSCLE_DISPLAY_MAP[muscleId as keyof typeof MUSCLE_DISPLAY_MAP] ??
    muscleId.replace("-", " ");

  const safeMax = Math.max(1e-6, maxVolume); // guard divide-by-zero
  const percent = Math.max(1, Math.round((weightedVolume / safeMax) * 100)); // min 1% so tiny bars are visible

  const exerciseCount = useMemo(
    () => countExercisesForMuscle(workout, exercises, muscleId),
    [workout, exercises, muscleId]
  );
  const contributors = useMemo(
    () => topContributors(workout, exercises, muscleId),
    [workout, exercises, muscleId]
  );

  const colorWithBucket = (bucket: number) =>
    // Tailwind blue-500 as base; reads premium and neutral with your palette.
    `rgba(59, 130, 246, ${Math.min(0.2 + bucket * 0.15, 0.9)})`;

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Row header */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Badge className="bg-muted text-muted-foreground rounded-full px-2.5">
          {index + 1}
        </Badge>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onClickMuscle?.(muscleId)}
              className="truncate text-sm font-medium text-foreground hover:underline"
              title={displayName}
            >
              {displayName}
            </button>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                  <Info className="h-3.5 w-3.5" />
                  Effective sets
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] bg-background text-xs leading-5">
                <div className="mb-1 font-medium text-foreground">
                  Effective sets = weighted volume
                </div>
                <div className="text-muted-foreground">
                  We weight each set by this muscle’s involvement in that
                  exercise. Support muscles contribute less than prime movers.
                </div>
                <div className="mt-2">
                  <div className="font-medium mb-1 text-foreground">
                    Top contributors
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-foreground">
                    {contributors.length ? (
                      contributors.map((c) => (
                        <li key={c.id}>
                          {c.name} — {c.pct}%
                        </li>
                      ))
                    ) : (
                      <li>No significant contributors</li>
                    )}
                  </ul>
                </div>
                <div className="mt-2 text-muted-foreground">
                  Used in <strong>{exerciseCount}</strong>{" "}
                  {exerciseCount === 1 ? "exercise" : "exercises"} this day.
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-label={`${displayName} effective sets`}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full bg-muted rounded h-1.5 overflow-hidden mt-2"
          >
            <div
              className="bg-primary h-full transition-all"
              style={{
                width: `${percent}%`,
                backgroundColor: colorWithBucket(percent),
              }}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-foreground">{setCount} sets</div>
          <div className="text-[11px] text-muted-foreground">
            ({weightedVolume.toFixed(1)} effective)
          </div>
        </div>
      </div>
    </div>
  );
};
