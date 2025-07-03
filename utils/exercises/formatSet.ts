import { IntensitySystem, SetInfo } from "@/types/Workout";

export function formatSet(set: SetInfo, intensity: IntensitySystem): string {
  const base = `${set.reps} reps`;

  switch (intensity) {
    case "rpe":
      return `${base} @ RPE ${set.rpe ?? "?"}`;
    case "one_rep_max_percent":
      return `${base} @ ${set.one_rep_max_percent ?? "?"}% 1RM`;
    case "rir":
      return `${base} @ ${set.rir ?? "?"} RIR`;
    default:
      return base;
  }
}
