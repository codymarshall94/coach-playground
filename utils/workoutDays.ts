import { ProgramDay } from "@/types/Workout";

export const createWorkoutDay = (index: number): ProgramDay => ({
  id: crypto.randomUUID(),
  name: `Day ${index + 1}`,
  type: "workout",
  order: index,
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
