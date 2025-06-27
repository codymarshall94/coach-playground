import { IntensitySystem, SetInfo } from "@/types/Workout";

export function generateAutoSets(system: IntensitySystem): SetInfo[] {
  switch (system) {
    case "rpe":
      return [
        { reps: 8, rpe: 8, rest: 90 },
        { reps: 8, rpe: 8, rest: 90 },
        { reps: 8, rpe: 8, rest: 90 },
      ];
    case "oneRepMaxPercent":
      return [
        { reps: 6, oneRepMaxPercent: 75, rest: 120 },
        { reps: 6, oneRepMaxPercent: 75, rest: 120 },
        { reps: 6, oneRepMaxPercent: 75, rest: 120 },
      ];
    case "rir":
      return [
        { reps: 10, rir: 2, rest: 90 },
        { reps: 10, rir: 2, rest: 90 },
        { reps: 10, rir: 2, rest: 90 },
      ];
    case "none":
    default:
      return [
        { reps: 8, rest: 90 },
        { reps: 8, rest: 90 },
        { reps: 8, rest: 90 },
      ];
  }
}
