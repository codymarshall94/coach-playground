import { Program, ProgramDay, WorkoutExerciseGroup } from "@/types/Workout";
import { getBlockWeekDays, normalizeBlock, setBlockWeekDays } from "@/utils/program/weekHelpers";

// ---------- Creation ----------
export const createWorkoutDay = (order = 0): ProgramDay => ({
  id: crypto.randomUUID(),
  name: `Day ${order + 1}`,
  order_num: order,
  type: "workout",
  description: "",
  groups: [], // start empty, groups are added later
});

export const createRestDay = (order: number): ProgramDay => ({
  id: crypto.randomUUID(),
  name: `Rest Day`,
  type: "rest",
  order_num: order,
  description: "",
  groups: [],
});

export function createDay(type: "workout" | "rest", order: number): ProgramDay {
  return type === "workout" ? createWorkoutDay(order) : createRestDay(order);
}

// ---------- Renumbering & Naming ----------
function isDefaultDayName(name: string) {
  return /^Day\s+\d+$/i.test((name ?? "").trim());
}

export function reindexDays(
  days: ProgramDay[],
  opts: { autoRenameDefault?: boolean } = { autoRenameDefault: true }
): ProgramDay[] {
  const { autoRenameDefault = true } = opts;
  return days.map((d, i) => ({
    ...d,
    order_num: i,
    name:
      autoRenameDefault && isDefaultDayName(d.name) ? `Day ${i + 1}` : d.name,
  }));
}

// ---------- Simple updates ----------
export function updateDayAt(
  days: ProgramDay[],
  index: number,
  updates: Partial<ProgramDay>,
  opts?: { autoRenameDefault?: boolean }
): ProgramDay[] {
  if (index < 0 || index >= days.length) return days;
  const next = [...days];
  next[index] = { ...next[index], ...updates };
  return reindexDays(next, opts);
}

// ---------- Insert / Remove / Move ----------
export function insertDayAt(
  days: ProgramDay[],
  index: number,
  day: ProgramDay,
  opts?: { autoRenameDefault?: boolean }
): ProgramDay[] {
  const next = [...days];
  const i = Math.max(0, Math.min(index, days.length));
  next.splice(i, 0, day);
  return reindexDays(next, opts);
}

export function removeDayAt(
  days: ProgramDay[],
  index: number,
  opts?: { autoRenameDefault?: boolean }
): ProgramDay[] {
  if (index < 0 || index >= days.length) return days;
  const next = days.filter((_, i) => i !== index);
  return reindexDays(next, opts);
}

export function moveDayWithinList(
  days: ProgramDay[],
  fromIndex: number,
  toIndex: number,
  opts?: { autoRenameDefault?: boolean }
): ProgramDay[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= days.length ||
    toIndex >= days.length
  ) {
    return reindexDays(days, opts);
  }
  const next = [...days];
  const [m] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, m);
  return reindexDays(next, opts);
}

// ---------- Program-level helpers ----------
export function getDaysFromProgram(
  program: Program,
  usingBlocks: boolean,
  blockIndex: number,
  weekIndex: number = 0
): ProgramDay[] {
  if (usingBlocks) {
    const block = program.blocks?.[blockIndex];
    if (!block) return [];
    return getBlockWeekDays(block, weekIndex);
  }
  return program.days ?? [];
}

export function setDaysInProgram(
  program: Program,
  usingBlocks: boolean,
  blockIndex: number,
  days: ProgramDay[],
  weekIndex: number = 0
): Program {
  if (usingBlocks) {
    const blocks = [...(program.blocks ?? [])];
    if (!blocks[blockIndex]) return program;
    const block = normalizeBlock(blocks[blockIndex]);
    const updated = setBlockWeekDays(block, weekIndex, days);
    blocks[blockIndex] = updated;
    return { ...program, blocks };
  }
  return { ...program, days };
}

export function removeDayFromProgram(
  program: Program,
  usingBlocks: boolean,
  blockIndex: number,
  dayIndex: number,
  opts?: { autoRenameDefault?: boolean },
  weekIndex: number = 0
): Program {
  const days = getDaysFromProgram(program, usingBlocks, blockIndex, weekIndex);
  const nextDays = removeDayAt(days, dayIndex, opts);
  return setDaysInProgram(program, usingBlocks, blockIndex, nextDays, weekIndex);
}

export function moveDayInProgram(
  program: Program,
  usingBlocks: boolean,
  blockIndex: number,
  fromIndex: number,
  toIndex: number,
  opts?: { autoRenameDefault?: boolean },
  weekIndex: number = 0
): Program {
  const days = getDaysFromProgram(program, usingBlocks, blockIndex, weekIndex);
  const nextDays = moveDayWithinList(days, fromIndex, toIndex, opts);
  return setDaysInProgram(program, usingBlocks, blockIndex, nextDays, weekIndex);
}

export function toggleDayType(
  day: ProgramDay,
  to: "workout" | "rest"
): ProgramDay {
  if (day.type === to) return day;
  if (to === "workout") {
    return { ...day, type: "workout", groups: [] };
  }
  return { ...day, type: "rest", groups: [] };
}

// ---------- Index handling ----------
export function nextActiveDayIndexAfterRemoval(
  prevActiveIndex: number | null,
  removedIndex: number,
  newLength: number
): number {
  if (newLength <= 0) return 0;
  if (prevActiveIndex === null) return 0;
  const shifted =
    prevActiveIndex > removedIndex ? prevActiveIndex - 1 : prevActiveIndex;
  return Math.max(0, Math.min(shifted, newLength - 1));
}

export function nextActiveDayIndexAfterInsert(
  prevActiveIndex: number | null,
  insertIndex: number
): number {
  if (prevActiveIndex === null) return insertIndex;
  return prevActiveIndex >= insertIndex ? prevActiveIndex + 1 : prevActiveIndex;
}

// ---------- Duplication ----------
export function duplicateDay(
  source: ProgramDay,
  nextOrder: number
): ProgramDay {
  return {
    ...source,
    id: crypto.randomUUID(),
    name: `${source.name} (Copy)`,
    order_num: nextOrder,
    groups: source.groups.map((g) => ({
      ...g,
      id: crypto.randomUUID?.() ?? undefined, // rekey if your type has id
      created_at: new Date(),
      updated_at: new Date(),
      exercises: g.exercises.map((ex) => ({
        ...ex,
        id: crypto.randomUUID?.() ?? ex.id, // new exercise id if needed
        order_num: ex.order_num,
      })),
    })) as WorkoutExerciseGroup[],
  };
}
