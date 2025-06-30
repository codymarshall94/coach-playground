import { Program } from "@/types/Workout";

export const createEmptyProgram = (): Program => {
  return {
    id: crypto.randomUUID(),
    name: "My Program",
    description: "",
    goal: "strength",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: crypto.randomUUID(),
        name: "Day 1",
        order: 0,
        type: "workout",
        description: "",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [],
          },
        ],
      },
    ],
  };
};
