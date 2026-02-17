import { ProgramDay } from "@/types/Workout";

import { Program } from "@/types/Workout";

export const createEmptyProgram = (
  mode: "days" | "blocks" = "days"
): Program => {
  const defaultWorkoutDay: ProgramDay = {
    id: crypto.randomUUID(),
    name: "Day 1",
    order_num: 0,
    type: "workout",
    description: "",
    groups: [],
  };

  return {
    id: crypto.randomUUID(),
    name: "My Program",
    description: "",
    goal: "strength",
    mode,
    created_at: new Date(),
    updated_at: new Date(),
    ...(mode === "blocks"
      ? {
          blocks: [
            {
              id: crypto.randomUUID(),
              name: "Block 1",
              order_num: 0,
              days: [defaultWorkoutDay],
              weeks: 4,
            },
          ],
        }
      : {
          days: [defaultWorkoutDay],
        }),
  };
};
