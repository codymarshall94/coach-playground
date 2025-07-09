// import { GuidanceTip } from "./guidanceRules";
// import type { Program } from "@/types/Workout";
// import { nanoid } from "nanoid";

// // Example helpers — replace with your actual insert logic
// import { createWorkoutExercise } from "@/utils/workout";

// export function applySmartSuggestion(
//   tip: GuidanceTip,
//   program: Program
// ): Program {
//   // Shallow clone for immutability
//   const updatedProgram = structuredClone(program);

//   // Example: push-pull imbalance
//   if (tip.id.includes("push-pull")) {
//     const targetDay = updatedProgram.blocks?.[0]?.days?.[0];
//     if (!targetDay) return program;

//     const newExercise = createWorkoutExercise("Lat Pulldown", {
//       sets: [{ reps: 10, rest: 60 }],
//       intensity: "rpe",
//     });

//     targetDay.workout?.[0].exercises.push({
//       id: nanoid(),
//       ...newExercise,
//     });
//   }

//   // Add other rule-based mutations as needed

//   return updatedProgram;
// }
