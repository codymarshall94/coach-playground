import { Program } from "@/types/Workout";

export const createWorkoutDay = (index: number): Program["days"][number] => ({
  id: crypto.randomUUID(),
  name: `Day ${index + 1}`,
  type: "workout",
  order: index,
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
});

export const createRestDay = (index: number): Program["days"][number] => ({
  id: crypto.randomUUID(),
  name: `Day ${index + 1}`,
  type: "rest",
  order: index,
  description: "",
  workout: [],
});
