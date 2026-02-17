import { IntensitySystem, SetInfo } from "@/types/Workout";

export function formatSet(set: SetInfo, intensity: IntensitySystem): string {
  let base: string;

  if (set.distance) {
    base = `${set.distance}m`;
  } else if (set.duration) {
    base = `${set.duration}s`;
  } else if (set.set_type === "amrap") {
    base = "AMRAP";
  } else if (set.reps_max && set.reps_max > set.reps) {
    base = `${set.reps}-${set.reps_max} reps`;
  } else {
    base = `${set.reps} reps`;
  }

  if (set.per_side) {
    base += " e/s";
  }

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
