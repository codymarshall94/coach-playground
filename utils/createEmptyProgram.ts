import { ProgramDay } from "@/types/Workout";

import { Program } from "@/types/Workout";

export const createEmptyProgram = (
  mode: "days" | "blocks" = "days"
): Program => {
  const defaultWorkoutDay: ProgramDay = {
    id: crypto.randomUUID(),
    name: "Day 1",
    order: 0,
    type: "workout",
    description: "",
    workout: [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        exercise_groups: [],
      },
    ],
  };

  return {
    id: crypto.randomUUID(),
    name: "My Program",
    description: "",
    goal: "strength",
    mode,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(mode === "blocks"
      ? {
          blocks: [
            {
              id: crypto.randomUUID(),
              name: "Block 1",
              order: 0,
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
