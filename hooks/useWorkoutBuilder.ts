import { getAllExercises } from "@/services/exerciseService";
import { Exercise } from "@/types/Exercise";
import {
  IntensitySystem,
  Program,
  ProgramBlock,
  ProgramDay,
  WorkoutExercise,
  WorkoutExerciseGroup,
} from "@/types/Workout";
import { createEmptyProgram } from "@/utils/createEmptyProgram";
import { createWorkoutExercise } from "@/utils/workout";
import { createRestDay, createWorkoutDay } from "@/utils/workoutDays";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useWorkoutBuilder(initialProgram?: Program) {
  const [program, setProgram] = useState<Program>(
    initialProgram ?? createEmptyProgram()
  );

  const usingBlocks = program.mode === "blocks";
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [targetGroupIndex, setTargetGroupIndex] = useState<number | null>(null);

  const { data: exercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getAllExercises() as Promise<Exercise[]>,
  });

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
  const isWorkoutDay = activeDay?.type === "workout";

  const exerciseGroups: WorkoutExerciseGroup[] = isWorkoutDay
    ? activeDay?.workout?.[0]?.exercise_groups ?? []
    : [];

  // === Mutators ===
  const updateProgram = (updater: (prev: Program) => Program) => {
    setProgram((prev) => updater(prev));
  };

  const updateDayWorkout = (groups: WorkoutExerciseGroup[]) => {
    updateProgram((prev) => {
      const day = { ...getDayRef(prev) } as ProgramDay;
      if (!day.workout || day.workout.length === 0) {
        day.workout = [
          {
            exercise_groups: groups,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      } else {
        day.workout[0].exercise_groups = groups;
        day.workout[0].updatedAt = new Date();
      }

      return setDayRef(prev, day);
    });
  };

  const updateExerciseSets = (
    groupIndex: number,
    exerciseIndex: number,
    sets: WorkoutExercise["sets"]
  ) => {
    const updatedGroups = [...exerciseGroups];
    const group = updatedGroups[groupIndex];
    if (!group) return;

    group.exercises[exerciseIndex] = {
      ...group.exercises[exerciseIndex],
      sets,
    };

    updateDayWorkout(updatedGroups);
  };

  const updateExerciseIntensity = (
    groupIndex: number,
    exerciseIndex: number,
    intensity: IntensitySystem
  ) => {
    updateDayWorkout(
      exerciseGroups.map((ex, i) =>
        i === groupIndex
          ? {
              ...ex,
              intensity,
              exercises: ex.exercises.map((exercise) => ({
                ...exercise,
                sets: exercise.sets.map((set) => ({
                  ...set,
                  rpe: intensity === "rpe" ? set.rpe ?? 8 : null,
                })),
              })),
            }
          : ex
      )
    );
  };

  const updateExerciseNotes = (
    groupIndex: number,
    exerciseIndex: number,
    notes: string
  ) => {
    updateDayWorkout(
      exerciseGroups.map((ex, i) =>
        i === groupIndex
          ? {
              ...ex,
              notes,
              exercises: ex.exercises.map((exercise) => ({
                ...exercise,
                notes,
              })),
            }
          : ex
      )
    );
  };

  const updateGroupType = (
    groupIndex: number,
    type: WorkoutExerciseGroup["type"]
  ) => {
    const updated = [...exerciseGroups];
    updated[groupIndex].type = type;
    if (type === "standard" && updated[groupIndex].exercises.length > 1) {
      updated[groupIndex].exercises = [updated[groupIndex].exercises[0]];
    }
    updateDayWorkout(updated);
  };

  const updateGroupRest = (groupIndex: number, rest: number) => {
    const updated = [...exerciseGroups];
    updated[groupIndex].rest_after_group = rest;
    updateDayWorkout(updated);
  };

  const moveExerciseToGroup = (
    fromGroupIndex: number,
    exerciseIndex: number,
    toGroupIndex: number
  ) => {
    if (fromGroupIndex === toGroupIndex) return;

    const updated = [...exerciseGroups];
    const [movedExercise] = updated[fromGroupIndex].exercises.splice(
      exerciseIndex,
      1
    );
    updated[toGroupIndex].exercises.push({
      ...movedExercise,
      order_num: updated[toGroupIndex].exercises.length,
    });

    updateDayWorkout(updated);
    setTargetGroupIndex(null);
  };

  const addExerciseToGroup = (groupIndex: number, exercise: Exercise) => {
    const intensity =
      exerciseGroups[groupIndex]?.exercises?.[0]?.intensity ?? "rpe";
    const updated = [...exerciseGroups];
    updated[groupIndex].exercises.push(
      createWorkoutExercise(
        exercise,
        intensity,
        updated[groupIndex].exercises.length
      )
    );
    updateDayWorkout(updated);
  };

  const addExercise = (exercise: Exercise) => {
    const intensity = exerciseGroups[0]?.exercises[0]?.intensity ?? "rpe";
    const newExercise = createWorkoutExercise(exercise, intensity, 0);

    const newGroup: WorkoutExerciseGroup = {
      id: crypto.randomUUID(),
      type: "standard",
      exercises: [newExercise],
    };

    updateDayWorkout([...exerciseGroups, newGroup]);
  };

  const removeExercise = (groupIndex: number, exerciseIndex: number) => {
    const updatedGroups = [...exerciseGroups];
    const group = updatedGroups[groupIndex];

    if (!group) return;

    if (group.exercises.length === 1) {
      updatedGroups.splice(groupIndex, 1);
    } else {
      group.exercises.splice(exerciseIndex, 1);
    }

    updateDayWorkout(updatedGroups);
  };

  const addSuperset = (exercises: Exercise[]) => {
    const intensity = exerciseGroups[0]?.exercises[0]?.intensity ?? "rpe";

    const supersetGroup: WorkoutExerciseGroup = {
      id: crypto.randomUUID(),
      type: "superset",
      rest_after_group: 60,
      exercises: exercises.map((ex, i) =>
        createWorkoutExercise(ex, intensity, i)
      ),
    };

    updateDayWorkout([...exerciseGroups, supersetGroup]);
  };

  const addGiantSet = (exercises: Exercise[]) => {
    const intensity = exerciseGroups[0]?.exercises[0]?.intensity ?? "rpe";

    const giantSetGroup: WorkoutExerciseGroup = {
      id: crypto.randomUUID(),
      type: "giant_set",
      rest_after_group: 120,
      exercises: exercises.map((ex, i) =>
        createWorkoutExercise(ex, intensity, i)
      ),
    };

    updateDayWorkout([...exerciseGroups, giantSetGroup]);
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
    updateProgram((prev) => {
      if (usingBlocks) {
        const blocks = [...(prev.blocks ?? [])];
        if (!blocks[activeBlockIndex]) return prev;

        const days = [...blocks[activeBlockIndex].days];
        days.splice(index, 1);

        blocks[activeBlockIndex] = {
          ...blocks[activeBlockIndex],
          days,
        };

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

  function updateGroupAtIndex(
    index: number,
    updater: (group: WorkoutExerciseGroup) => WorkoutExerciseGroup
  ) {
    const updated = [...exerciseGroups];
    updated[index] = updater(updated[index]);
    updateDayWorkout(updated);
  }

  function updateExerciseAtIndex(
    groupIndex: number,
    exerciseIndex: number,
    updater: (ex: WorkoutExercise) => WorkoutExercise
  ) {
    const updated = [...exerciseGroups];
    const group = updated[groupIndex];
    group.exercises[exerciseIndex] = updater(group.exercises[exerciseIndex]);
    updateDayWorkout(updated);
  }

  function createGroupWithExercises(
    exercises: Exercise[],
    type: WorkoutExerciseGroup["type"],
    restAfterGroup: number
  ): WorkoutExerciseGroup {
    const intensity = exerciseGroups[0]?.exercises[0]?.intensity ?? "rpe";
    return {
      id: crypto.randomUUID(),
      type,
      rest_after_group: restAfterGroup,
      exercises: exercises.map((ex, i) =>
        createWorkoutExercise(ex, intensity, i)
      ),
    };
  }

  function createSingleExerciseGroup(ex: Exercise): WorkoutExerciseGroup {
    const intensity = exerciseGroups[0]?.exercises[0]?.intensity ?? "rpe";
    const newExercise = createWorkoutExercise(ex, intensity, 0);
    return {
      id: crypto.randomUUID(),
      type: "standard",
      exercises: [newExercise],
    };
  }

  const handleDuplicateWorkoutDay = (index: number) => {
    updateProgram((prev) => {
      const isBlockMode = prev.mode === "blocks";
      const blocks = [...(prev.blocks ?? [])];
      const days = isBlockMode
        ? [...(blocks[activeBlockIndex]?.days ?? [])]
        : [...(prev.days ?? [])];

      const sourceDay = days[index];
      if (!sourceDay) return prev;

      const duplicate: ProgramDay = {
        ...sourceDay,
        id: crypto.randomUUID(),
        name: `${sourceDay.name} (Copy)`,
        order: sourceDay.order + 1,
        workout: sourceDay.workout.map((w) => ({
          ...w,
          exercise_groups: w.exercise_groups.map((group) => ({
            ...group,
            exercises: group.exercises.map((ex, i) => ({
              ...ex,
              order_num: ex.order_num + 1,
            })),
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      };

      const updatedDays = [...days, duplicate];

      if (isBlockMode) {
        blocks[activeBlockIndex] = {
          ...blocks[activeBlockIndex],
          days: updatedDays,
        };

        return {
          ...prev,
          blocks,
        };
      }

      return {
        ...prev,
        days: updatedDays,
      };
    });

    // Use a separate `useEffect` or manual set here
    // to avoid stale index update issues
    setActiveDayIndex((prevIndex) => prevIndex + 1);
  };

  const addTrainingBlock = () => {
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
    updateProgram((prev) => {
      const existingBlocks = prev.blocks ?? [];

      const hydrated = reordered.map((b, i) => {
        const original = existingBlocks.find((ob) => ob.id === b.id);
        return {
          ...b,
          weeks: b.weeks ?? original?.weeks ?? 4, // fix here
          order: i,
        };
      });

      return { ...prev, blocks: hydrated };
    });
  };

  function moveExerciseByIdToGroup(
    exerciseId: string,
    targetGroupIndex: number
  ) {
    const updatedGroups = [...exerciseGroups];
    let movedExercise: WorkoutExercise | null = null;
    let fromGroupIndex = -1;

    // Step 1: Find and remove the exercise from its current group
    for (let i = 0; i < updatedGroups.length; i++) {
      const group = updatedGroups[i];
      const index = group.exercises.findIndex((ex) => ex.id === exerciseId);
      if (index !== -1) {
        [movedExercise] = group.exercises.splice(index, 1);
        fromGroupIndex = i;
        break;
      }
    }

    // Guard clause
    if (!movedExercise) return;

    // Step 2: Optionally remove the old group if now empty
    if (updatedGroups[fromGroupIndex].exercises.length === 0) {
      updatedGroups.splice(fromGroupIndex, 1);

      // Adjust target index if it shifted from above
      if (fromGroupIndex < targetGroupIndex) {
        targetGroupIndex -= 1;
      }
    }

    // Step 3: Add to target group
    const targetGroup = updatedGroups[targetGroupIndex];
    movedExercise.order_num = targetGroup.exercises.length;
    targetGroup.exercises.push(movedExercise);

    updateDayWorkout(updatedGroups);
  }

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
    exercises,
    setProgram,
    activeDayIndex,
    setActiveDayIndex,
    activeBlockIndex,
    setActiveBlockIndex,
    exerciseGroups,
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
    addSuperset,
    addGiantSet,
    updateGroupType,
    updateGroupRest,
    addExerciseToGroup,
    moveExerciseToGroup,
    targetGroupIndex,
    setTargetGroupIndex,
    moveExerciseByIdToGroup,
  };
}
