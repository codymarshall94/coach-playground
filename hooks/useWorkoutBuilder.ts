import {
  Exercise,
  IntensitySystem,
  Program,
  WorkoutExercise,
} from "@/types/Workout";
import { createEmptyProgram } from "@/utils/createEmptyProgram";
import { createWorkoutExercise } from "@/utils/workout";
import { createRestDay, createWorkoutDay } from "@/utils/workoutDays";
import { useState } from "react";

export function useWorkoutBuilder(initialProgram?: Program) {
  const [program, setProgram] = useState<Program>(
    initialProgram ?? createEmptyProgram()
  );
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const workout = program.days[activeDayIndex]?.workout[0].exercises ?? [];

  const updateProgram = (updater: (prev: Program) => Program) => {
    setProgram((prev) => updater(prev));
  };

  const updateDayWorkout = (exercises: WorkoutExercise[]) => {
    updateProgram((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[activeDayIndex].workout[0].exercises = exercises;
      return { ...prev, days: updatedDays };
    });
  };

  const updateExerciseIntensity = (
    index: number,
    intensity: IntensitySystem
  ) => {
    updateDayWorkout(
      workout.map((ex, i) =>
        i === index
          ? {
              ...ex,
              intensity,
              sets: ex.sets.map((set) => ({
                reps: set.reps,
                rest: set.rest,
                rpe: intensity === "rpe" ? set.rpe ?? 8 : undefined,
                oneRepMaxPercent:
                  intensity === "oneRepMaxPercent"
                    ? set.oneRepMaxPercent ?? 75
                    : undefined,
                rir: intensity === "rir" ? set.rir ?? 2 : undefined,
              })),
            }
          : ex
      )
    );
  };

  const addExercise = (exercise: Exercise) => {
    updateDayWorkout([
      ...workout,
      createWorkoutExercise(
        exercise,
        program.days[activeDayIndex].workout[0].exercises.length > 0
          ? program.days[activeDayIndex].workout[0].exercises[0].intensity
          : "rpe"
      ),
    ]);
  };

  const removeExercise = (index: number) => {
    updateDayWorkout(workout.filter((_, i) => i !== index));
  };

  const updateExerciseSets = (index: number, sets: WorkoutExercise["sets"]) => {
    updateDayWorkout(
      workout.map((ex, i) => (i === index ? { ...ex, sets } : ex))
    );
  };

  const handleRemoveWorkoutDay = (index: number) => {
    updateProgram((prev) => {
      const newDays = prev.days.filter((_, i) => i !== index);
      const newActiveIndex = Math.max(
        0,
        Math.min(activeDayIndex, newDays.length - 1)
      );
      setActiveDayIndex(newActiveIndex);
      return { ...prev, days: newDays };
    });
  };

  const handleDuplicateWorkoutDay = (index: number) => {
    setProgram((prev) => {
      const target = prev.days[index];
      const duplicate = {
        ...target,
        id: crypto.randomUUID(),
        name: `${target.name} (Copy)`,
        order: prev.days.length,
        workout: target.workout.map((w) => ({
          ...w,
          exercises: w.exercises.map((ex) => ({ ...ex })),
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      };
      const updated = [...prev.days, duplicate];
      setActiveDayIndex(updated.length - 1);
      return {
        ...prev,
        days: updated,
      };
    });
  };

  const updateDayName = (name: string) => {
    updateProgram((prev) => {
      const newDays = [...prev.days];
      newDays[activeDayIndex].name = name;
      return { ...prev, days: newDays };
    });
  };

  const handleAddDay = (type: "workout" | "rest") => {
    updateProgram((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        type === "workout"
          ? createWorkoutDay(prev.days.length)
          : createRestDay(prev.days.length),
      ],
    }));
    setActiveDayIndex(program.days.length);
  };

  const clearWorkout = () => {
    updateDayWorkout([]);
  };

  return {
    program,
    setProgram,
    activeDayIndex,
    setActiveDayIndex,
    workout,
    updateDayWorkout,
    updateExerciseIntensity,
    addExercise,
    removeExercise,
    updateExerciseSets,
    clearWorkout,
    handleRemoveWorkoutDay,
    handleDuplicateWorkoutDay,
    updateDayName,
    handleAddDay,
  };
}
