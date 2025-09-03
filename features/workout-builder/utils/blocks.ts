import { createWorkoutDay } from "@/features/workout-builder/utils/days";
import type { Program, ProgramBlock } from "@/types/Workout";

export function addBlock(program: Program): Program {
  const newDay = createWorkoutDay(0);
  const nextBlock: ProgramBlock = {
    id: crypto.randomUUID(),
    name: `Block ${program.blocks?.length ? program.blocks.length + 1 : 1}`,
    order_num: program.blocks?.length ?? 0,
    weeks: 4,
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

export function reorderBlocks(
  program: Program,
  reordered: ProgramBlock[]
): Program {
  const existing = program.blocks ?? [];
  const hydrated = reordered.map((b, i) => {
    const orig = existing.find((ob) => ob.id === b.id);
    return { ...b, weeks: b.weeks ?? orig?.weeks ?? 4, order: i };
  });
  return { ...program, blocks: hydrated };
}
