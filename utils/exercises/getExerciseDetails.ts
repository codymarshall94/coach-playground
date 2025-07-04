import { Exercise } from "@/types/Exercise";
import { WorkoutExercise } from "@/types/Workout";

export function getExerciseDetails(
  workout: WorkoutExercise[],
  exercises: Exercise[]
): Exercise[] | undefined {
  return workout
    .map((we) => exercises.find((ex) => ex.id === we.id))
    .filter(Boolean) as Exercise[] | undefined;
}
