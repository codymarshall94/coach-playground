import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { EXERCISES } from "@/data/exercises";
import { Muscle, WorkoutExercise } from "@/types/Workout";

interface MuscleVolumeRowProps {
  index: number;
  muscleId: string;
  setCount: number;
  weightedVolume: number;
  maxVolume: number;
  workout: WorkoutExercise[]; // needed for exercise count
}

const countExercisesForMuscle = (
  workout: WorkoutExercise[],
  muscleId: string
): number => {
  const uniqueExerciseIds = new Set(
    workout
      .map((ex) =>
        EXERCISES.find((e) => e.id === ex.id)?.activationMap?.[
          muscleId as Muscle
        ]
          ? ex.id
          : null
      )
      .filter(Boolean)
  );
  return uniqueExerciseIds.size;
};

export const MuscleVolumeRow: React.FC<MuscleVolumeRowProps> = ({
  index,
  muscleId,
  setCount,
  weightedVolume,
  maxVolume,
  workout,
}) => {
  const displayName =
    MUSCLE_DISPLAY_MAP[muscleId as keyof typeof MUSCLE_DISPLAY_MAP];
  const percent = (weightedVolume / maxVolume) * 100;

  const exerciseCount = countExercisesForMuscle(workout, muscleId);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            className={`text-white ${
              index + 1 > 3 ? "bg-slate-300" : "bg-slate-500"
            }`}
          >
            {index + 1}
          </Badge>
          <span className="capitalize text-slate-600">{displayName}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">{setCount} sets</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-slate-400 text-[10px] underline cursor-help">
                ({weightedVolume.toFixed(1)} weighted)
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px] text-xs">
              Weighted based on the muscle’s involvement in each set. Lower
              values mean the muscle plays more of a support role.
              <br />
              <br />
              This muscle is used in <strong>{exerciseCount}</strong>{" "}
              {exerciseCount === 1 ? "exercise" : "exercises"} in this workout.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded h-1 overflow-hidden">
        <div
          className="bg-slate-500 h-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
