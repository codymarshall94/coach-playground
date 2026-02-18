import { Program, ProgramBlock, ProgramDay, ProgramWeek } from "@/types/Workout";
import { getBlockWeekDays, normalizeBlock } from "@/utils/program/weekHelpers";

export function getDayRef(
  program: Program,
  usingBlocks: boolean,
  activeBlockIndex: number,
  activeDayIndex: number | null,
  activeWeekIndex: number = 0
): ProgramDay | null {
  if (usingBlocks) {
    const block = program.blocks?.[activeBlockIndex];
    if (!block) return null;
    const days = getBlockWeekDays(block, activeWeekIndex);
    if (
      activeDayIndex === null ||
      activeDayIndex >= days.length
    )
      return null;
    return days[activeDayIndex] ?? null;
  }
  return program.days?.[activeDayIndex ?? 0] ?? null;
}

export function setDayRef(
  program: Program,
  usingBlocks: boolean,
  activeBlockIndex: number,
  activeDayIndex: number | null,
  updatedDay: ProgramDay,
  activeWeekIndex: number = 0
): Program {
  if (usingBlocks) {
    const blocks = [...(program.blocks ?? [])];
    if (!blocks[activeBlockIndex]) return program;
    const block = normalizeBlock(blocks[activeBlockIndex]);
    const weekIdx = activeWeekIndex;
    const updatedWeeks = block.weeks.map((w, i) => {
      if (i !== weekIdx) return w;
      const days = [...w.days];
      days[activeDayIndex ?? 0] = updatedDay;
      return { ...w, days };
    });
    blocks[activeBlockIndex] = {
      ...block,
      weeks: updatedWeeks,
      days: updatedWeeks[0].days,
    };
    return { ...program, blocks };
  } else {
    const days = [...(program.days ?? [])];
    days[activeDayIndex ?? 0] = updatedDay;
    return { ...program, days };
  }
}

export function getCurrentDays(
  program: Program,
  usingBlocks: boolean,
  activeBlockIndex: number,
  activeWeekIndex: number = 0
): ProgramDay[] {
  if (usingBlocks) {
    const block = program.blocks?.[activeBlockIndex];
    if (!block) return [];
    return getBlockWeekDays(block, activeWeekIndex);
  }
  return program.days ?? [];
}

export function switchModeToDays(program: Program): Program {
  if (!program.blocks) return program;
  const merged: ProgramDay[] = program.blocks
    .flatMap((b) => b.days)
    .map((d, i) => ({ ...d, order: i }));
  return { ...program, mode: "days", blocks: undefined, days: merged };
}

export function switchModeToBlocks(program: Program): Program {
  if (!program.days) return program;
  const days = program.days.map((d, i) => ({ ...d, order_num: i }));
  const week1: ProgramWeek = {
    id: crypto.randomUUID(),
    weekNumber: 1,
    label: "Week 1",
    days,
  };
  const block: ProgramBlock = {
    id: crypto.randomUUID(),
    name: `Block ${program.blocks?.length ?? 0 + 1}`,
    order_num: 0,
    days,
    weeks: [week1],
  };
  return { ...program, mode: "blocks", days: undefined, blocks: [block] };
}
