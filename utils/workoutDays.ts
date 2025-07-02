import { ProgramDay } from "@/types/Workout";

export const createWorkoutDay = (order = 0): ProgramDay => ({
  id: crypto.randomUUID(),
  name: `Day ${order + 1}`,
  order,
  type: "workout",
  description: "",
  workout: [
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      exercises: [],
    },
  ],
});

export const createRestDay = (index: number): ProgramDay => ({
  id: crypto.randomUUID(),
  name: `Day ${index + 1}`,
  type: "rest",
  order: index,
  description: "",
  workout: [],
});
