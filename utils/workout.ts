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
  const [minReps, maxReps] = exercise.ideal_rep_range ?? [8, 12];
  const avgReps = Math.round((minReps + maxReps) / 2);

  const getIntensityDefaults = (): Partial<SetInfo> => {
    switch (intensity) {
      case "rpe":
        return { rpe: 8, rir: null, one_rep_max_percent: null };
      case "one_rep_max_percent":
        return { one_rep_max_percent: 75, rpe: null, rir: null };
      case "rir":
        return { rir: 2, rpe: null, one_rep_max_percent: null };
      default:
        return { rpe: null, rir: null, one_rep_max_percent: null };
    }
  };

  return {
    id: crypto.randomUUID(), // unique per workout exercise
    exercise_id: exercise.id, // links back to exercise catalog
    order_num: order,
    display_name: exercise.name,
    intensity,
    notes: "",
    sets: Array.from({ length: sets }, (_, i) => ({
      id: crypto.randomUUID(),
      set_index: i,
      set_type: "standard",
      reps: avgReps,
      rest: 90,
      rpe: null,
      rir: null,
      one_rep_max_percent: null,
      ...getIntensityDefaults(),
    })),
  };
}
