import type { Exercise } from "@/types/Exercise";
import type {
  IntensitySystem,
  SetInfo,
  WorkoutExercise,
} from "@/types/Workout";

export function createWorkoutExercise(
  exercise: Exercise,
  intensity: IntensitySystem,
  order: number,
  sets: number = 3
): WorkoutExercise {
  const reps = Math.round(
    (exercise.ideal_rep_range[0] + exercise.ideal_rep_range[1]) / 2
  );

  const getIntensity = (): Partial<SetInfo> => {
    switch (intensity) {
      case "rpe":
        return { rpe: 8, rir: null, one_rep_max_percent: null };
      case "one_rep_max_percent":
        return { one_rep_max_percent: 75, rir: null, rpe: null };
      case "rir":
        return { rir: 2, rpe: null, one_rep_max_percent: null };
      default:
        return { rpe: null, rir: null, one_rep_max_percent: null };
    }
  };

  return {
    id: exercise.id,
    exercise_id: exercise.id,
    order_num: order,
    name: exercise.name,
    intensity,
    sets: Array.from({ length: sets }, () => ({
      rpe: null,
      rir: null,
      one_rep_max_percent: null,
      reps,
      rest: 90,
      ...getIntensity(),
      set_type: "standard",
    })),
  };
}
