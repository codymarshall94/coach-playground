import {
  Exercise,
  IntensitySystem,
  Program,
  ProgramBlock,
  ProgramDay,
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

  const usingBlocks = program.mode === "blocks";
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // === Safe Getters ===
  const getDayRef = (p: Program = program): ProgramDay | null => {
    if (usingBlocks) {
      const block = p.blocks?.[activeBlockIndex];
      if (!block || activeDayIndex >= block.days.length) return null;
      return block.days[activeDayIndex] ?? null;
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

  const getCurrentDays = (): ProgramDay[] => {
    return usingBlocks
      ? program.blocks?.[activeBlockIndex]?.days ?? []
      : program.days ?? [];
  };

  const getActiveDaySafe = (): ProgramDay | null => {
    const days = getCurrentDays();
    return days?.[activeDayIndex] ?? null;
  };

  const activeDay = getDayRef();
  const isWorkoutDay =
    activeDay?.type === "workout" && !!activeDay?.workout?.[0];

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

  const updateDayDetails = (updates: Partial<ProgramDay>) => {
    updateProgram((prev) => {
      const day = { ...getDayRef(prev), ...updates } as ProgramDay;
      return setDayRef(prev, day);
    });
  };

  const handleAddDay = (type: "workout" | "rest") => {
    const nextOrder = usingBlocks
      ? program.blocks?.[activeBlockIndex]?.days.length ?? 0
      : program.days?.length ?? 0;

    const newDay =
      type === "workout"
        ? createWorkoutDay(nextOrder)
        : createRestDay(nextOrder);

    updateProgram((prev) => {
      if (usingBlocks) {
        const blocks = [...(prev.blocks ?? [])];
        const targetBlock = blocks[activeBlockIndex];
        if (!targetBlock) return prev;

        const updatedDays = [...targetBlock.days, newDay];
        blocks[activeBlockIndex] = { ...targetBlock, days: updatedDays };

        setActiveDayIndex(updatedDays.length - 1);

        return { ...prev, blocks };
      } else {
        const updatedDays = [...(prev.days ?? []), newDay];

        setActiveDayIndex(updatedDays.length - 1);

        return { ...prev, days: updatedDays };
      }
    });
  };

  const handleRemoveWorkoutDay = (index: number) => {
    if (!program.blocks?.[activeBlockIndex]) return;

    updateProgram((prev) => {
      if (usingBlocks) {
        const blocks = [...(prev.blocks ?? [])];
        const days = [...blocks[activeBlockIndex].days];
        days.splice(index, 1);
        blocks[activeBlockIndex].days = days;
        setActiveDayIndex(Math.max(0, days.length - 1));
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
    console.log(`current blocks: ${program.blocks?.length}`);
    updateProgram((prev) => {
      const newDay = createWorkoutDay(0);

      const newBlock = {
        id: crypto.randomUUID(),
        name: `Block ${prev.blocks?.length ? prev.blocks.length + 1 : 1}`,
        order: prev.blocks?.length ? prev.blocks.length : 0,
        weeks: 4,
        days: [newDay],
      };

      const newBlocks = [...(prev.blocks ?? []), newBlock];

      setActiveBlockIndex(newBlocks.length - 1);
      setActiveDayIndex(0);

      return { ...prev, blocks: newBlocks };
    });
  };

  const removeTrainingBlock = (index: number) => {
    updateProgram((prev) => {
      const blocks = [...(prev.blocks ?? [])];
      if (index < 0 || index >= blocks.length) return prev;

      blocks.splice(index, 1);
      setActiveBlockIndex(Math.max(0, blocks.length - 1));
      setActiveDayIndex(0); // optionally reset to 0

      return { ...prev, blocks };
    });
  };

  const updateBlockDetails = (
    index: number,
    updates: Partial<ProgramBlock>
  ) => {
    updateProgram((prev) => {
      const blocks = [...(prev.blocks ?? [])];
      if (!blocks[index]) return prev;

      blocks[index] = { ...blocks[index], ...updates };
      return { ...prev, blocks };
    });
  };

  const reorderBlocks = (reordered: ProgramBlock[]) => {
    updateProgram((prev) => ({ ...prev, blocks: reordered }));
  };

  const confirmModeSwitch = (newMode: "blocks" | "days") => {
    const safeToSwitch =
      program.mode === newMode ||
      window.confirm(
        `Switching to "${newMode}" mode may discard existing structure.\n\nDo you want to proceed?`
      );

    if (!safeToSwitch) return;

    updateProgram((prev) => {
      if (newMode === "days" && prev.blocks) {
        const mergedDays: ProgramDay[] = prev.blocks
          .flatMap((block) => block.days)
          .map((day, i) => ({ ...day, order: i }));

        return {
          ...prev,
          mode: "days",
          blocks: undefined,
          days: mergedDays,
        };
      }

      if (newMode === "blocks" && prev.days) {
        const defaultBlock: ProgramBlock = {
          id: crypto.randomUUID(),
          name: `Block ${prev.blocks?.length ?? 0 + 1}`,
          order: 0,
          days: prev.days.map((day, i) => ({ ...day, order: i })),
          weeks: 4,
        };

        return {
          ...prev,
          mode: "blocks",
          days: undefined,
          blocks: [defaultBlock],
        };
      }

      return { ...prev, mode: newMode };
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
    updateDayDetails,
    handleAddDay,
    handleRemoveWorkoutDay,
    handleDuplicateWorkoutDay,
    addTrainingBlock,
    removeTrainingBlock,
    updateBlockDetails,
    reorderBlocks,
    usingBlocks,
    getCurrentDays,
    getActiveDaySafe,
    confirmModeSwitch,
  };
}
