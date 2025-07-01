import { EXERCISES } from "@/data/exercises";
import { Exercise, WorkoutExercise } from "@/types/Workout";

export function getExerciseDetails(workout: WorkoutExercise[]): Exercise[] {
  return workout
    .map((we) => EXERCISES.find((ex) => ex.id === we.id))
    .filter(Boolean) as Exercise[];
}
