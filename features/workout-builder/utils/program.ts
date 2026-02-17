import { Program, ProgramBlock, ProgramDay } from "@/types/Workout";

export function getDayRef(
  program: Program,
  usingBlocks: boolean,
  activeBlockIndex: number,
  activeDayIndex: number | null
): ProgramDay | null {
  if (usingBlocks) {
    const block = program.blocks?.[activeBlockIndex];
    if (
      !block ||
      activeDayIndex === null ||
      activeDayIndex >= block.days.length
    )
      return null;
    return block.days[activeDayIndex] ?? null;
  }
  return program.days?.[activeDayIndex ?? 0] ?? null;
}

export function setDayRef(
  program: Program,
  usingBlocks: boolean,
  activeBlockIndex: number,
  activeDayIndex: number | null,
  updatedDay: ProgramDay
): Program {
  if (usingBlocks) {
    const blocks = [...(program.blocks ?? [])];
    if (!blocks[activeBlockIndex]) return program;
    const days = [...blocks[activeBlockIndex].days];
    days[activeDayIndex ?? 0] = updatedDay;
    blocks[activeBlockIndex] = { ...blocks[activeBlockIndex], days };
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
  activeBlockIndex: number
): ProgramDay[] {
  return usingBlocks
    ? program.blocks?.[activeBlockIndex]?.days ?? []
    : program.days ?? [];
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
  const block: ProgramBlock = {
    id: crypto.randomUUID(),
    name: `Block ${program.blocks?.length ?? 0 + 1}`,
    order_num: 0,
    days: program.days.map((d, i) => ({ ...d, order_num: i })),
    weeks: 4,
  };
  return { ...program, mode: "blocks", days: undefined, blocks: [block] };
}
