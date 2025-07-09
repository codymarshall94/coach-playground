// import type { ProgramDay } from "@/types/Workout";

// export type GuidanceTip = {
//   id: string;
//   message: string;
//   actionLabel?: string;
//   type: "fatigue" | "balance" | "volume" | "safety" | "misc";
//   score?: number; // optional to sort most urgent
// };

// export function evaluateDayGuidance(day: ProgramDay): GuidanceTip[] {
//   const tips: GuidanceTip[] = [];

//   const fatigue = day.fatigueScore ?? 0;
//   if (fatigue >= 7.5) {
//     tips.push({
//       id: `high-fatigue-${day.id}`,
//       type: "fatigue",
//       message: "Your CNS fatigue is high. Consider reducing load or reps.",
//       actionLabel: "Adjust Load",
//       score: fatigue,
//     });
//   }

//   if (day.pushPullRatio && (day.pushPullRatio < 0.7 || day.pushPullRatio > 1.3)) {
//     tips.push({
//       id: `push-pull-imbalance-${day.id}`,
//       type: "balance",
//       message: "Your push/pull ratio is slightly imbalanced.",
//       actionLabel: "Add Pull Exercise",
//       score: Math.abs(1 - day.pushPullRatio),
//     });
//   }

//   if (day.upperLowerRatio && (day.upperLowerRatio < 0.6 || day.upperLowerRatio > 1.4)) {
//     tips.push({
//       id: `upper-lower-imbalance-${day.id}`,
//       type: "balance",
//       message: "Your upper/lower ratio is off. Try adding more upper body work.",
//       actionLabel: "Add Upper Exercise",
//       score: Math.abs(1 - day.upperLowerRatio),
//     });
//   }

//   if (day.totalVolume && day.totalVolume > 25000) {
//     tips.push({
//       id: `volume-too-high-${day.id}`,
//       type: "volume",
//       message: "Total volume is extremely high. Consider trimming sets.",
//       actionLabel: "Review Volume",
//       score: day.totalVolume,
//     });
//   }

//   return tips;
// }
