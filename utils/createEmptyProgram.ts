import { Program } from "@/types/Workout";

export const createEmptyProgram = (): Program => {
  return {
    id: crypto.randomUUID(),
    name: "My Program",
    description: "My Program Description",
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
            name: "Main Workout",
            description: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [],
          },
        ],
      },
    ],
  };
};
