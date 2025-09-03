"use client";

import { useCallback, useState } from "react";
import { useExercises } from "./useExercises";

import type { Exercise } from "@/types/Exercise";
import type {
  IntensitySystem,
  Program,
  ProgramBlock,
  ProgramDay,
  SetInfo,
  WorkoutExerciseGroup,
} from "@/types/Workout";

import { createEmptyProgram } from "@/utils/createEmptyProgram";

// Block utils
import {
  removeBlock as _removeBlock,
  reorderBlocks as _reorderBlocks,
  updateBlock as _updateBlock,
  addBlock,
} from "@/features/workout-builder/utils/blocks";

// Group utils
import {
  addExerciseToGroup as _addExerciseToGroup,
  moveExerciseByIdToGroup as _moveExerciseByIdToGroup,
  removeExercise as _removeExercise,
  updateGroupRest as _updateGroupRest,
  updateGroupType as _updateGroupType,
  addExerciseAsNewGroup,
  createMultiExerciseGroup,
  moveExerciseBetweenGroups,
} from "@/features/workout-builder/utils/groups";

import { switchExerciseIntensity } from "@/features/workout-builder/utils/intensity";

// Program/day utils
import {
  getCurrentDays as _getCurrentDays,
  getDayRef as _getDayRef,
  setDayRef as _setDayRef,
  switchModeToBlocks,
  switchModeToDays,
} from "@/features/workout-builder/utils/program";

import {
  createDay,
  duplicateDay,
  moveDayInProgram,
  nextActiveDayIndexAfterRemoval,
  removeDayFromProgram,
} from "@/features/workout-builder/utils/days";

// -----------------------------------------------------------------------------
// Small helper for group updates
// -----------------------------------------------------------------------------
function updateGroup(
  groups: WorkoutExerciseGroup[],
  index: number,
  updater: (g: WorkoutExerciseGroup) => WorkoutExerciseGroup
): WorkoutExerciseGroup[] {
  return groups.map((g, i) => (i === index ? updater(g) : g));
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------
export function useWorkoutBuilder(initialProgram?: Program) {
  const [program, setProgram] = useState<Program>(
    initialProgram ?? createEmptyProgram()
  );

  const usingBlocks = program.mode === "blocks";
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(0);
  const [targetGroupIndex, setTargetGroupIndex] = useState<number | null>(null);
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

  const { data: exercises } = useExercises();

  const activeDay = _getDayRef(
    program,
    usingBlocks,
    activeBlockIndex,
    activeDayIndex
  );
  const isWorkoutDay = activeDay?.type === "workout";

  const exerciseGroups: WorkoutExerciseGroup[] = isWorkoutDay
    ? activeDay?.groups ?? []
    : [];

  const baseIntensity: IntensitySystem =
    exerciseGroups[0]?.exercises[0]?.intensity ?? "rpe";

  // ---------- Program + Day helpers ----------
  const getCurrentDays = useCallback(
    (): ProgramDay[] => _getCurrentDays(program, usingBlocks, activeBlockIndex),
    [program, usingBlocks, activeBlockIndex]
  );

  const getActiveDaySafe = useCallback((): ProgramDay | null => {
    const days = getCurrentDays();
    return days?.[activeDayIndex ?? 0] ?? null;
  }, [getCurrentDays, activeDayIndex]);

  const updateProgram = useCallback((updater: (prev: Program) => Program) => {
    setProgram((prev) => updater(prev));
  }, []);

  const editActiveDay = useCallback(
    (mutator: (day: ProgramDay) => ProgramDay) => {
      updateProgram((prev) => {
        const ref = _getDayRef(
          prev,
          usingBlocks,
          activeBlockIndex,
          activeDayIndex
        );
        if (!ref) return prev;
        const updated = mutator({ ...ref, groups: ref.groups ?? [] });
        return _setDayRef(
          prev,
          usingBlocks,
          activeBlockIndex,
          activeDayIndex,
          updated
        );
      });
    },
    [updateProgram, usingBlocks, activeBlockIndex, activeDayIndex]
  );

  // ---------- Group + Exercise mutations ----------
  const updateDayGroups = useCallback(
    (groups: WorkoutExerciseGroup[]) => {
      editActiveDay((day) => ({ ...day, groups }));
    },
    [editActiveDay]
  );

  const updateExerciseSets = useCallback(
    (groupIndex: number, exerciseIndex: number, sets: SetInfo[]) => {
      updateDayGroups(
        updateGroup(exerciseGroups, groupIndex, (g) => {
          const exs = g.exercises.map((ex, i) =>
            i === exerciseIndex ? { ...ex, sets } : ex
          );
          return { ...g, exercises: exs };
        })
      );
    },
    [exerciseGroups, updateDayGroups]
  );

  const updateExerciseIntensity = useCallback(
    (groupIndex: number, exerciseIndex: number, intensity: IntensitySystem) => {
      updateDayGroups(
        updateGroup(exerciseGroups, groupIndex, (g) => {
          const exs = g.exercises.map((ex, i) =>
            i === exerciseIndex
              ? {
                  ...ex,
                  intensity,
                  sets: switchExerciseIntensity(ex.sets, intensity),
                }
              : ex
          );
          return { ...g, exercises: exs };
        })
      );
    },
    [exerciseGroups, updateDayGroups]
  );

  const updateExerciseNotes = useCallback(
    (groupIndex: number, notes: string) => {
      updateDayGroups(
        updateGroup(exerciseGroups, groupIndex, (g) => ({
          ...g,
          notes,
          exercises: g.exercises.map((e) => ({ ...e, notes })),
        }))
      );
    },
    [exerciseGroups, updateDayGroups]
  );

  const updateGroupType = useCallback(
    (groupIndex: number, type: WorkoutExerciseGroup["type"]) => {
      updateDayGroups(_updateGroupType(exerciseGroups, groupIndex, type));
    },
    [exerciseGroups, updateDayGroups]
  );

  const updateGroupRest = useCallback(
    (groupIndex: number, rest: number) => {
      updateDayGroups(_updateGroupRest(exerciseGroups, groupIndex, rest));
    },
    [exerciseGroups, updateDayGroups]
  );

  const moveExerciseToGroup = useCallback(
    (fromGroupIndex: number, exerciseIndex: number, toGroupIndex: number) => {
      updateDayGroups(
        moveExerciseBetweenGroups(
          exerciseGroups,
          fromGroupIndex,
          exerciseIndex,
          toGroupIndex
        )
      );
      setTargetGroupIndex(null);
    },
    [exerciseGroups, updateDayGroups]
  );

  const addExerciseToGroup = useCallback(
    (groupIndex: number, exercise: Exercise) => {
      updateDayGroups(
        _addExerciseToGroup(exerciseGroups, groupIndex, exercise)
      );
    },
    [exerciseGroups, updateDayGroups]
  );

  const addExercise = useCallback(
    (exercise: Exercise) => {
      const next = addExerciseAsNewGroup(
        exerciseGroups,
        exercise,
        baseIntensity
      );
      updateDayGroups(next);
      setLastAddedIndex(next.length - 1);
    },
    [exerciseGroups, baseIntensity, updateDayGroups]
  );

  const removeExercise = useCallback(
    (groupIndex: number, exerciseIndex: number) => {
      updateDayGroups(
        _removeExercise(exerciseGroups, groupIndex, exerciseIndex)
      );
    },
    [exerciseGroups, updateDayGroups]
  );

  const addSuperset = useCallback(
    (list: Exercise[]) => {
      updateDayGroups(
        createMultiExerciseGroup(
          exerciseGroups,
          "superset",
          list,
          baseIntensity,
          60
        )
      );
    },
    [exerciseGroups, baseIntensity, updateDayGroups]
  );

  const addGiantSet = useCallback(
    (list: Exercise[]) => {
      updateDayGroups(
        createMultiExerciseGroup(
          exerciseGroups,
          "giant_set",
          list,
          baseIntensity,
          120
        )
      );
    },
    [exerciseGroups, baseIntensity, updateDayGroups]
  );

  const clearWorkout = useCallback(
    () => updateDayGroups([]),
    [updateDayGroups]
  );

  const moveExerciseByIdToGroup = useCallback(
    (exerciseId: string, targetGroupIndex: number) => {
      updateDayGroups(
        _moveExerciseByIdToGroup(exerciseGroups, exerciseId, targetGroupIndex)
      );
    },
    [exerciseGroups, updateDayGroups]
  );

  // ---------- Day control ----------
  const updateDayDetails = useCallback(
    (updates: Partial<ProgramDay>) => {
      editActiveDay((day) => ({ ...day, ...updates }));
    },
    [editActiveDay]
  );

  const handleAddDay = useCallback(
    (type: "workout" | "rest") => {
      const nextOrder = usingBlocks
        ? program.blocks?.[activeBlockIndex]?.days.length ?? 0
        : program.days?.length ?? 0;

      const newDay = createDay(type, nextOrder);

      updateProgram((prev) => {
        if (usingBlocks) {
          const blocks = [...(prev.blocks ?? [])];
          const blk = blocks[activeBlockIndex];
          if (!blk) return prev;
          const days = [...blk.days, newDay];
          blocks[activeBlockIndex] = { ...blk, days };
          return { ...prev, blocks };
        } else {
          const days = [...(prev.days ?? []), newDay];
          return { ...prev, days };
        }
      });

      setActiveDayIndex((i) => (i === null ? 0 : nextOrder));
    },
    [usingBlocks, program, activeBlockIndex, updateProgram]
  );

  const handleRemoveWorkoutDay = useCallback(
    (index: number) => {
      const current = usingBlocks
        ? program.blocks?.[activeBlockIndex]?.days ?? []
        : program.days ?? [];

      const newLength = Math.max(0, current.length - 1);
      const nextActive = nextActiveDayIndexAfterRemoval(
        activeDayIndex ?? 0,
        index,
        newLength
      );

      updateProgram((prev) =>
        removeDayFromProgram(prev, usingBlocks, activeBlockIndex, index, {
          autoRenameDefault: true,
        })
      );
      setActiveDayIndex(nextActive);
    },
    [program, usingBlocks, activeBlockIndex, activeDayIndex, updateProgram]
  );

  const handleDuplicateWorkoutDay = useCallback(
    (index: number) => {
      updateProgram((prev) => {
        const isBlock = prev.mode === "blocks";
        const blocks = [...(prev.blocks ?? [])];
        const days = isBlock
          ? [...(blocks[activeBlockIndex]?.days ?? [])]
          : [...(prev.days ?? [])];

        const src = days[index];
        if (!src) return prev;

        const dup = duplicateDay(src, (src.order_num ?? index) + 1);
        const updatedDays = [...days, dup];

        if (isBlock) {
          blocks[activeBlockIndex] = {
            ...blocks[activeBlockIndex],
            days: updatedDays,
          };
          return { ...prev, blocks };
        }
        return { ...prev, days: updatedDays };
      });

      setActiveDayIndex((v) => (v ?? 0) + 1);
    },
    [activeBlockIndex, updateProgram]
  );

  const moveDay = useCallback(
    (from: number, to: number) => {
      updateProgram((prev) =>
        moveDayInProgram(prev, usingBlocks, activeBlockIndex, from, to, {
          autoRenameDefault: true,
        })
      );
      setActiveDayIndex((curr) => {
        if (curr === null) return curr;
        if (curr === from) return to;
        if (from < curr && curr <= to) return curr - 1;
        if (to <= curr && curr < from) return curr + 1;
        return curr;
      });
    },
    [usingBlocks, activeBlockIndex, updateProgram]
  );

  // ---------- Blocks ----------
  const addTrainingBlock = useCallback(() => {
    updateProgram((prev) => addBlock(prev));
    setActiveBlockIndex((i) => i + 1);
    setActiveDayIndex(0);
  }, [updateProgram]);

  const removeTrainingBlock = useCallback(
    (index: number) => {
      updateProgram((prev) => _removeBlock(prev, index));
      setActiveBlockIndex((i) => Math.max(0, i - 1));
      setActiveDayIndex(0);
    },
    [updateProgram]
  );

  const updateBlockDetails = useCallback(
    (index: number, updates: Partial<ProgramBlock>) => {
      updateProgram((prev) => _updateBlock(prev, index, updates));
    },
    [updateProgram]
  );

  const reorderBlocks = useCallback(
    (reordered: ProgramBlock[]) => {
      updateProgram((prev) => _reorderBlocks(prev, reordered));
    },
    [updateProgram]
  );

  // ---------- Mode switch ----------
  const confirmModeSwitch = useCallback(
    (newMode: "blocks" | "days") => {
      const safe =
        program.mode === newMode ||
        window.confirm(
          `Switching to "${newMode}" mode may discard existing structure.\n\nDo you want to proceed?`
        );
      if (!safe) return;

      updateProgram((prev) => {
        if (newMode === "days" && prev.blocks) return switchModeToDays(prev);
        if (newMode === "blocks" && prev.days) return switchModeToBlocks(prev);
        return { ...prev, mode: newMode };
      });
    },
    [program.mode, updateProgram]
  );

  // ---------- Public API ----------
  return {
    program,
    exercises,

    // indices / UI state
    activeDayIndex,
    setActiveDayIndex,
    activeBlockIndex,
    setActiveBlockIndex,
    targetGroupIndex,
    setTargetGroupIndex,
    lastAddedIndex,
    setLastAddedIndex,

    // selectors
    usingBlocks,
    isWorkoutDay,
    exerciseGroups,
    getCurrentDays,
    getActiveDaySafe,

    // group + exercise
    updateDayGroups,
    updateExerciseSets,
    updateExerciseIntensity,
    updateExerciseNotes,
    addExercise,
    removeExercise,
    clearWorkout,
    addSuperset,
    addGiantSet,
    updateGroupType,
    updateGroupRest,
    addExerciseToGroup,
    moveExerciseToGroup,
    moveExerciseByIdToGroup,

    // days
    updateDayDetails,
    handleAddDay,
    handleRemoveWorkoutDay,
    handleDuplicateWorkoutDay,
    moveDay,

    // blocks
    addTrainingBlock,
    removeTrainingBlock,
    updateBlockDetails,
    reorderBlocks,

    // program
    confirmModeSwitch,
    setProgram,
  };
}
