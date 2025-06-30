import { useState } from "react";
import {
  Exercise,
  IntensitySystem,
  Program,
  ProgramDay,
  WorkoutExercise,
} from "@/types/Workout";
import { createEmptyProgram } from "@/utils/createEmptyProgram";
import { createWorkoutExercise } from "@/utils/workout";
import { createRestDay, createWorkoutDay } from "@/utils/workoutDays";

export function useWorkoutBuilder(initialProgram?: Program) {
  const [program, setProgram] = useState<Program>(
    initialProgram ?? createEmptyProgram()
  );

  const usingBlocks = !!program.blocks?.length;
  const [activeBlockIndex, setActiveBlockIndex] = useState<number>(
    usingBlocks ? 0 : 0
  );
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // === Safe Getters ===
  const getDayRef = (p: Program = program): ProgramDay | null => {
    if (usingBlocks) {
      return p.blocks?.[activeBlockIndex]?.days?.[activeDayIndex] ?? null;
    }
    return p.days?.[activeDayIndex] ?? null;
  };

  const setDayRef = (p: Program, updatedDay: ProgramDay): Program => {
    if (usingBlocks) {
      const blocks = [...(p.blocks ?? [])];
      if (!blocks[activeBlockIndex]) return p;
      const days = [...blocks[activeBlockIndex].days];
      days[activeDayIndex] = updatedDay;
      blocks[activeBlockIndex] = { ...blocks[activeBlockIndex], days };
      return { ...p, blocks };
    } else {
      const days = [...(p.days ?? [])];
      days[activeDayIndex] = updatedDay;
      return { ...p, days };
    }
  };

  const activeDay = getDayRef();
  const isWorkoutDay =
    activeDay?.type === "workout" &&
    activeDay.workout?.[0]?.exercises?.length >= 0;

  const workout: WorkoutExercise[] = isWorkoutDay
    ? activeDay!.workout[0].exercises
    : [];

  // === Mutators ===
  const updateProgram = (updater: (prev: Program) => Program) => {
    setProgram((prev) => updater(prev));
  };

  const updateDayWorkout = (exercises: WorkoutExercise[]) => {
    updateProgram((prev) => {
      const day = { ...getDayRef(prev) } as ProgramDay;
      if (!day || day.type !== "workout") return prev;
      day.workout![0].exercises = exercises;
      return setDayRef(prev, day);
    });
  };

  const updateExerciseSets = (index: number, sets: WorkoutExercise["sets"]) => {
    updateDayWorkout(
      workout.map((ex, i) => (i === index ? { ...ex, sets } : ex))
    );
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

  const updateExerciseNotes = (index: number, notes: string) => {
    updateDayWorkout(
      workout.map((ex, i) => (i === index ? { ...ex, notes } : ex))
    );
  };

  const addExercise = (exercise: Exercise) => {
    const intensity = workout.length > 0 ? workout[0].intensity : "rpe";
    updateDayWorkout([...workout, createWorkoutExercise(exercise, intensity)]);
  };

  const removeExercise = (index: number) => {
    updateDayWorkout(workout.filter((_, i) => i !== index));
  };

  const clearWorkout = () => {
    updateDayWorkout([]);
  };

  // === Day Control ===
  const updateDayName = (name: string) => {
    updateProgram((prev) => {
      const day = { ...getDayRef(prev), name } as ProgramDay;
      return setDayRef(prev, day);
    });
  };

  const handleAddDay = (type: "workout" | "rest") => {
    const newDay = type === "workout" ? createWorkoutDay(0) : createRestDay(0);

    updateProgram((prev) => {
      if (usingBlocks) {
        const blocks = [...(prev.blocks ?? [])];
        blocks[activeBlockIndex].days.push(newDay);
        return { ...prev, blocks };
      } else {
        const days = [...(prev.days ?? []), newDay];
        return { ...prev, days };
      }
    });

    setActiveDayIndex(() =>
      usingBlocks
        ? program.blocks![activeBlockIndex].days.length
        : program.days!.length
    );
  };

  const handleRemoveWorkoutDay = (index: number) => {
    updateProgram((prev) => {
      if (usingBlocks) {
        const blocks = [...(prev.blocks ?? [])];
        const days = [...blocks[activeBlockIndex].days];
        days.splice(index, 1);
        blocks[activeBlockIndex].days = days;
        setActiveDayIndex(
          Math.max(0, Math.min(activeDayIndex, days.length - 1))
        );
        return { ...prev, blocks };
      } else {
        const days = [...(prev.days ?? [])].filter((_, i) => i !== index);
        setActiveDayIndex(
          Math.max(0, Math.min(activeDayIndex, days.length - 1))
        );
        return { ...prev, days };
      }
    });
  };

  const handleDuplicateWorkoutDay = (index: number) => {
    updateProgram((prev) => {
      const sourceDay = usingBlocks
        ? prev.blocks?.[activeBlockIndex]?.days[index]
        : prev.days?.[index];
      if (!sourceDay) return prev;

      const duplicate = {
        ...sourceDay,
        id: crypto.randomUUID(),
        name: `${sourceDay.name} (Copy)`,
        order: sourceDay.order + 1,
        workout: sourceDay.workout.map((w) => ({
          ...w,
          exercises: w.exercises.map((ex) => ({ ...ex })),
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      };

      if (usingBlocks) {
        const blocks = [...(prev.blocks ?? [])];
        blocks[activeBlockIndex].days.push(duplicate);
        setActiveDayIndex(blocks[activeBlockIndex].days.length - 1);
        return { ...prev, blocks };
      } else {
        const days = [...(prev.days ?? []), duplicate];
        setActiveDayIndex(days.length - 1);
        return { ...prev, days };
      }
    });
  };

  const addTrainingBlock = () => {
    updateProgram((prev) => {
      const newBlock = {
        id: crypto.randomUUID(),
        name: `Block ${prev.blocks?.length + 1 || 1}`,
        order: prev.blocks?.length + 1 || 1,
        weeks: 3,
        days: [],
      };
      const newBlocks = [...(prev.blocks ?? []), newBlock];
      setActiveBlockIndex(newBlocks.length - 1); // ✅ updated index
      setActiveDayIndex(0);
      return { ...prev, blocks: newBlocks };
    });
  };

  return {
    program,
    setProgram,
    activeDayIndex,
    setActiveDayIndex,
    activeBlockIndex,
    setActiveBlockIndex,
    workout,
    isWorkoutDay,
    updateDayWorkout,
    updateExerciseSets,
    updateExerciseIntensity,
    updateExerciseNotes,
    addExercise,
    removeExercise,
    clearWorkout,
    updateDayName,
    handleAddDay,
    handleRemoveWorkoutDay,
    handleDuplicateWorkoutDay,
    addTrainingBlock,
    usingBlocks,
  };
}
