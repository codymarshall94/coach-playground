import { Exercise } from "@/types/Exercise";
import {
  WorkoutExercise,
  WorkoutExerciseGroup,
  WorkoutExerciseGroupType,
} from "@/types/Workout";
import { createWorkoutExercise } from "@/utils/workout";

/** Stamp order_num = index */
export function reindexGroups(
  groups: WorkoutExerciseGroup[]
): WorkoutExerciseGroup[] {
  return groups.map((g, i) => ({ ...g, order_num: i }));
}

/** Add a single-exercise "standard" group at the end */
export function addExerciseAsNewGroup(
  groups: WorkoutExerciseGroup[],
  exercise: Exercise,
  intensity: WorkoutExercise["intensity"]
): WorkoutExerciseGroup[] {
  const newExercise = createWorkoutExercise(exercise, intensity, 0);
  const newGroup: WorkoutExerciseGroup = {
    id: crypto.randomUUID(),
    type: "standard",
    order_num: groups.length,
    exercises: [newExercise],
  };
  return reindexGroups([...groups, newGroup]);
}

/** Add an exercise to an existing group */
export function addExerciseToGroup(
  groups: WorkoutExerciseGroup[],
  groupIndex: number,
  exercise: Exercise,
  intensityFallback: WorkoutExercise["intensity"] = "rpe"
): WorkoutExerciseGroup[] {
  return groups.map((g, i) =>
    i === groupIndex
      ? {
          ...g,
          exercises: [
            ...g.exercises,
            createWorkoutExercise(
              exercise,
              g.exercises[0]?.intensity ?? intensityFallback,
              g.exercises.length
            ),
          ],
        }
      : g
  );
}

/** Remove an exercise; drop the group if empty */
export function removeExercise(
  groups: WorkoutExerciseGroup[],
  groupIndex: number,
  exerciseIndex: number
): WorkoutExerciseGroup[] {
  return reindexGroups(
    groups.flatMap((g, i) => {
      if (i !== groupIndex) return [g];
      const nextExs = g.exercises.filter((_, j) => j !== exerciseIndex);
      return nextExs.length > 0 ? [{ ...g, exercises: nextExs }] : [];
    })
  );
}

/** Move an exercise from one group to another; remove source if empty */
export function moveExerciseBetweenGroups(
  groups: WorkoutExerciseGroup[],
  fromGroupIndex: number,
  exerciseIndex: number,
  toGroupIndex: number
): WorkoutExerciseGroup[] {
  if (fromGroupIndex === toGroupIndex) return groups;
  const next = [...groups];
  const from = next[fromGroupIndex];
  const to = next[toGroupIndex];
  if (!from || !to) return groups;

  const [moved] = from.exercises.splice(exerciseIndex, 1);
  if (!moved) return groups;

  const adjustedToIndex =
    from.exercises.length === 0 && fromGroupIndex < toGroupIndex
      ? toGroupIndex - 1
      : toGroupIndex;

  const target = next[adjustedToIndex];
  next[adjustedToIndex] = {
    ...target,
    exercises: [
      ...target.exercises,
      { ...moved, order_num: target.exercises.length },
    ],
  };

  if (from.exercises.length === 0) {
    next.splice(fromGroupIndex, 1);
  } else {
    next[fromGroupIndex] = { ...from };
  }

  return reindexGroups(next);
}

/** Move an exercise by ID into another group */
export function moveExerciseByIdToGroup(
  groups: WorkoutExerciseGroup[],
  exerciseId: string,
  targetGroupIndex: number
): WorkoutExerciseGroup[] {
  let moved: WorkoutExercise | undefined;
  const next = groups
    .map((g) => {
      const idx = g.exercises.findIndex((e) => e.id === exerciseId);
      if (idx === -1) return g;
      const newExs = [...g.exercises];
      [moved] = newExs.splice(idx, 1);
      return { ...g, exercises: newExs };
    })
    .filter((g) => g.exercises.length > 0); // drop empty groups

  if (!moved) return groups;

  if (targetGroupIndex >= next.length) targetGroupIndex = next.length - 1;

  const tgt = next[targetGroupIndex];
  next[targetGroupIndex] = {
    ...tgt,
    exercises: [
      ...tgt.exercises,
      { ...moved, order_num: tgt.exercises.length },
    ],
  };

  return reindexGroups(next);
}

/** Change a group's type */
export function updateGroupType(
  groups: WorkoutExerciseGroup[],
  groupIndex: number,
  type: WorkoutExerciseGroup["type"]
): WorkoutExerciseGroup[] {
  return groups.map((g, i) =>
    i === groupIndex
      ? {
          ...g,
          type,
          exercises:
            type === "standard" && g.exercises.length > 1
              ? [g.exercises[0]]
              : g.exercises,
        }
      : g
  );
}

/** Update group rest */
export function updateGroupRest(
  groups: WorkoutExerciseGroup[],
  groupIndex: number,
  rest: number
): WorkoutExerciseGroup[] {
  return groups.map((g, i) =>
    i === groupIndex ? { ...g, rest_after_group: rest } : g
  );
}

/** Create a multi-exercise group (superset, giant set, circuit) */
export function createMultiExerciseGroup(
  groups: WorkoutExerciseGroup[],
  type: WorkoutExerciseGroupType,
  exercises: Exercise[],
  intensity: WorkoutExercise["intensity"],
  defaultRest: number
): WorkoutExerciseGroup[] {
  const newGroup: WorkoutExerciseGroup = {
    id: crypto.randomUUID(),
    type,
    rest_after_group: defaultRest,
    order_num: groups.length,
    exercises: exercises.map((ex, i) =>
      createWorkoutExercise(ex, intensity, i)
    ),
  };
  return reindexGroups([...groups, newGroup]);
}
