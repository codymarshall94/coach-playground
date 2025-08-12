import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { Exercise, Muscle } from "@/types/Exercise";
import { WorkoutExercise } from "@/types/Workout";

interface MuscleVolumeRowProps {
  index: number;
  muscleId: string;
  setCount: number;
  weightedVolume: number;
  maxVolume: number;
  workout: WorkoutExercise[]; // needed for exercise count
  exercises: Exercise[];
}

const countExercisesForMuscle = (
  workout: WorkoutExercise[],
  exercises: Exercise[],
  muscleId: string
): number => {
  const uniqueExerciseIds = new Set(
    workout
      .map((ex) =>
        exercises?.find((e) => e.id === ex.id)?.activation_map?.[
          muscleId as Muscle
        ]
          ? ex.id
          : null
      )
      .filter(Boolean)
  );
  return uniqueExerciseIds.size;
};

export const MuscleVolumeRow = ({
  index,
  muscleId,
  setCount,
  weightedVolume,
  maxVolume,
  workout,
  exercises,
}: MuscleVolumeRowProps) => {
  const displayName =
    MUSCLE_DISPLAY_MAP[muscleId as keyof typeof MUSCLE_DISPLAY_MAP];
  const percent = (weightedVolume / maxVolume) * 100;

  const exerciseCount = countExercisesForMuscle(workout, exercises, muscleId);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={` bg-secondary text-secondary-foreground  `}>
            {index + 1}
          </Badge>
          <span className="capitalize text-muted-foreground">
            {displayName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{setCount} sets</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground text-[10px] underline cursor-help">
                ({weightedVolume.toFixed(1)} weighted)
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px] text-xs">
              Weighted based on the muscle's involvement in each set. Lower
              values mean the muscle plays more of a support role.
              <br />
              <br />
              This muscle is used in <strong>{exerciseCount}</strong>{" "}
              {exerciseCount === 1 ? "exercise" : "exercises"} in this workout.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="w-full bg-muted rounded h-1 overflow-hidden">
        <div
          className="bg-primary h-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
