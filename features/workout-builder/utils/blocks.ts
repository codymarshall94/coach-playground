import { createWorkoutDay } from "@/features/workout-builder/utils/days";
import type { Program, ProgramBlock, ProgramWeek } from "@/types/Workout";
import { deepCloneDays } from "@/utils/program/weekHelpers";

export function addBlock(program: Program): Program {
  const newDay = createWorkoutDay(0);
  const week1: ProgramWeek = {
    id: crypto.randomUUID(),
    weekNumber: 1,
    label: "Week 1",
    days: [newDay],
  };
  const nextBlock: ProgramBlock = {
    id: crypto.randomUUID(),
    name: `Block ${program.blocks?.length ? program.blocks.length + 1 : 1}`,
    order_num: program.blocks?.length ?? 0,
    weeks: [week1],
    days: [newDay],
  };
  return { ...program, blocks: [...(program.blocks ?? []), nextBlock] };
}

export function removeBlock(program: Program, index: number): Program {
  const blocks = [...(program.blocks ?? [])];
  if (index < 0 || index >= blocks.length) return program;
  blocks.splice(index, 1);
  return { ...program, blocks };
}

export function updateBlock(
  program: Program,
  index: number,
  updates: Partial<ProgramBlock>
): Program {
  const blocks = [...(program.blocks ?? [])];
  if (!blocks[index]) return program;
  blocks[index] = { ...blocks[index], ...updates };
  return { ...program, blocks };
}

export function duplicateBlock(program: Program, index: number): Program {
  const blocks = [...(program.blocks ?? [])];
  const source = blocks[index];
  if (!source) return program;

  const clonedWeeks: ProgramWeek[] = (source.weeks ?? []).map((w) => ({
    id: crypto.randomUUID(),
    weekNumber: w.weekNumber,
    label: w.label,
    days: deepCloneDays(w.days),
  }));

  const cloned: ProgramBlock = {
    id: crypto.randomUUID(),
    name: `${source.name || `Block ${index + 1}`} (Copy)`,
    order_num: blocks.length,
    description: source.description,
    weeks: clonedWeeks,
    days: clonedWeeks[0]?.days ?? deepCloneDays(source.days),
  };

  blocks.splice(index + 1, 0, cloned);
  return { ...program, blocks };
}

export function reorderBlocks(
  program: Program,
  reordered: ProgramBlock[]
): Program {
  const existing = program.blocks ?? [];
  const hydrated = reordered.map((b, i) => {
    const orig = existing.find((ob) => ob.id === b.id);
    return { ...b, weeks: b.weeks ?? orig?.weeks ?? [], order: i };
  });
  return { ...program, blocks: hydrated };
}
