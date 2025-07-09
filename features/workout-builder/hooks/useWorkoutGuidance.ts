// import { useMemo } from "react";
// import type { Program } from "@/types/Workout";
// import { evaluateDayGuidance, GuidanceTip } from "../utils/guidanceRules";

// export function useWorkoutGuidance(program: Program): GuidanceTip[] {
//   return useMemo(() => {
//     if (!program?.blocks?.length) return [];

//     const tips: GuidanceTip[] = [];

//     for (const block of program.blocks) {
//       for (const day of block.days) {
//         tips.push(...evaluateDayGuidance(day));
//       }
//     }

//     // Optionally sort by severity/score
//     return tips.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
//   }, [program]);
// }
