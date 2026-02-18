import type { ProgramBlock, ProgramDay, ProgramWeek } from "@/types/Workout";

/**
 * Get the days for a specific week within a block.
 * Falls back to block.days (week 0) for backward compatibility.
 */
export function getBlockWeekDays(
  block: ProgramBlock,
  weekIndex: number
): ProgramDay[] {
  if (block.weeks?.length > 0) {
    return block.weeks[weekIndex]?.days ?? block.weeks[0]?.days ?? [];
  }
  // Legacy fallback: block only has .days, no weeks array
  return block.days ?? [];
}

/**
 * Get the total number of weeks in a block.
 * Falls back to weekCount or 1.
 */
export function getBlockWeekCount(block: ProgramBlock): number {
  if (block.weeks?.length > 0) return block.weeks.length;
  return block.weekCount ?? 1;
}

/**
 * Create a new empty ProgramWeek from a set of days (deep clone).
 */
export function createWeek(
  weekNumber: number,
  sourceDays: ProgramDay[],
  label?: string
): ProgramWeek {
  return {
    id: crypto.randomUUID(),
    weekNumber,
    label,
    days: deepCloneDays(sourceDays),
  };
}

/**
 * Deep-clone days so each week has independent copies.
 */
export function deepCloneDays(days: ProgramDay[]): ProgramDay[] {
  return days.map((d) => ({
    ...d,
    id: crypto.randomUUID(),
    groups: d.groups.map((g) => ({
      ...g,
      id: crypto.randomUUID(),
      exercises: g.exercises.map((ex) => ({
        ...ex,
        id: crypto.randomUUID(),
        sets: ex.sets.map((s) => ({ ...s })),
      })),
    })),
  }));
}

/**
 * Normalize a ProgramBlock that might be in the legacy format
 * (no weeks array, just days + weeks number) to the new format.
 */
export function normalizeBlock(block: ProgramBlock): ProgramBlock {
  if (block.weeks?.length > 0) {
    // Already normalized — ensure .days mirrors weeks[0]
    return { ...block, days: block.weeks[0].days };
  }

  // Legacy block: convert .days into a single-week structure
  const week0: ProgramWeek = {
    id: crypto.randomUUID(),
    weekNumber: 1,
    label: "Week 1",
    days: block.days ?? [],
  };

  return {
    ...block,
    weeks: [week0],
    days: week0.days,
  };
}

/**
 * Normalize all blocks in a program.
 */
export function normalizeBlockWeeks(
  blocks: ProgramBlock[]
): ProgramBlock[] {
  return blocks.map(normalizeBlock);
}

/**
 * Add a new week to a block by cloning the last week's days.
 */
export function addWeekToBlock(block: ProgramBlock): ProgramBlock {
  const normalized = normalizeBlock(block);
  const newWeekNumber = normalized.weeks.length + 1;

  // Create an empty week (no days) instead of cloning the last week.
  const newWeek = createWeek(newWeekNumber, [], `Week ${newWeekNumber}`);

  const updatedWeeks = [...normalized.weeks, newWeek];
  return {
    ...normalized,
    weeks: updatedWeeks,
    days: updatedWeeks[0].days, // keep .days in sync with week 0
  };
}

/**
 * Remove a week from a block. Cannot remove the last remaining week.
 */
export function removeWeekFromBlock(
  block: ProgramBlock,
  weekIndex: number
): ProgramBlock {
  const normalized = normalizeBlock(block);
  if (normalized.weeks.length <= 1) return normalized; // never remove last week

  const updatedWeeks = normalized.weeks.filter((_, i) => i !== weekIndex);
  // Renumber
  const renumbered = updatedWeeks.map((w, i) => ({
    ...w,
    weekNumber: i + 1,
    label: w.label?.startsWith("Week ") ? `Week ${i + 1}` : w.label,
  }));

  return {
    ...normalized,
    weeks: renumbered,
    days: renumbered[0].days,
  };
}

/**
 * Duplicate a specific week within a block.
 * Inserts the clone right after the source week and renumbers.
 */
export function duplicateWeekInBlock(
  block: ProgramBlock,
  weekIndex: number
): ProgramBlock {
  const normalized = normalizeBlock(block);
  const source = normalized.weeks[weekIndex];
  if (!source) return normalized;

  const cloned: ProgramWeek = {
    id: crypto.randomUUID(),
    weekNumber: weekIndex + 2, // will be renumbered below
    label: `${source.label || `Week ${weekIndex + 1}`} (Copy)`,
    days: deepCloneDays(source.days),
  };

  const updatedWeeks = [
    ...normalized.weeks.slice(0, weekIndex + 1),
    cloned,
    ...normalized.weeks.slice(weekIndex + 1),
  ];

  // Renumber all weeks
  const renumbered = updatedWeeks.map((w, i) => ({
    ...w,
    weekNumber: i + 1,
    label: w.label?.match(/^Week \d+$/)
      ? `Week ${i + 1}`
      : w.label?.replace(/ \(Copy\)$/, "").endsWith(`Week ${w.weekNumber}`)
        ? w.label
        : w.label,
  }));

  return {
    ...normalized,
    weeks: renumbered,
    days: renumbered[0].days,
  };
}

/**
 * Update the days within a specific week of a block.
 */
export function setBlockWeekDays(
  block: ProgramBlock,
  weekIndex: number,
  days: ProgramDay[]
): ProgramBlock {
  const normalized = normalizeBlock(block);
  const updatedWeeks = normalized.weeks.map((w, i) =>
    i === weekIndex ? { ...w, days } : w
  );
  return {
    ...normalized,
    weeks: updatedWeeks,
    days: updatedWeeks[0].days,
  };
}
