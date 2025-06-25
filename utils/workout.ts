import type { Exercise, WorkoutExercise } from "@/types/Workout";

export function createWorkoutExercise(exercise: Exercise): WorkoutExercise {
  return {
    id: exercise.id,
    name: exercise.name,
    sets: [
      {
        reps: 8,
        weight: 0,
        rest: 90,
      },
    ],
  };
}
