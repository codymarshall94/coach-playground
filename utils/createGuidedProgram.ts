import type { Program, ProgramBlock, ProgramDay, ProgramGoal, ProgramWeek } from "@/types/Workout";

export interface GuidedSetupConfig {
  name: string;
  goal: ProgramGoal;
  mode: "days" | "blocks";
  splitCount: number;
}

function createWorkoutDay(order: number): ProgramDay {
  return {
    id: crypto.randomUUID(),
    name: `Day ${order + 1}`,
    order_num: order,
    type: "workout",
    description: "",
    groups: [],
  };
}

function createRestDay(order: number): ProgramDay {
  return {
    id: crypto.randomUUID(),
    name: "Rest Day",
    order_num: order,
    type: "rest",
    description: "",
    groups: [],
  };
}

/**
 * Build a pre-filled Program from the guided-setup wizard answers.
 *
 * - **Days mode**: creates `splitCount` workout days, filling out to 7 total
 *   with rest days at the end.
 * - **Blocks mode**: creates `splitCount` empty blocks, each with one workout
 *   day and a single week.
 */
export function createGuidedProgram(config: GuidedSetupConfig): Program {
  const { name, goal, mode, splitCount } = config;

  if (mode === "blocks") {
    const blocks: ProgramBlock[] = Array.from({ length: splitCount }, (_, i) => {
      const day = createWorkoutDay(0);
      const week: ProgramWeek = {
        id: crypto.randomUUID(),
        weekNumber: 1,
        label: "Week 1",
        days: [day],
      };
      return {
        id: crypto.randomUUID(),
        name: `Block ${i + 1}`,
        order_num: i,
        weeks: [week],
        days: [day],
      };
    });

    return {
      id: crypto.randomUUID(),
      name,
      description: "",
      goal,
      mode: "blocks",
      blocks,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  // Days mode — N workout days + rest days to fill a 7-day week
  const days: ProgramDay[] = [];
  for (let i = 0; i < splitCount; i++) {
    days.push(createWorkoutDay(i));
  }
  const remaining = 7 - splitCount;
  for (let i = 0; i < remaining; i++) {
    days.push(createRestDay(splitCount + i));
  }

  return {
    id: crypto.randomUUID(),
    name,
    description: "",
    goal,
    mode: "days",
    days,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
