import type {
  Exercise,
  IntensitySystem,
  SetInfo,
  WorkoutExercise,
} from "@/types/Workout";

export function createWorkoutExercise(
  exercise: Exercise,
  intensity: IntensitySystem,
  sets: number = 3
): WorkoutExercise {
  const reps = Math.round(
    (exercise.ideal_rep_range[0] + exercise.ideal_rep_range[1]) / 2
  );

  const getIntensity = (): Partial<SetInfo> => {
    switch (intensity) {
      case "rpe":
        return { rpe: 8 };
      case "oneRepMaxPercent":
        return { oneRepMaxPercent: 75 };
      case "rir":
        return { rir: 2 };
      default:
        return {};
    }
  };

  return {
    id: exercise.id,
    name: exercise.name,
    intensity,
    sets: Array.from({ length: sets }, () => ({
      reps,
      rest: 90,
      ...getIntensity(),
    })),
  };
}
