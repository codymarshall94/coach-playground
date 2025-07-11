import { IntensitySystem, SetInfo } from "@/types/Workout";

export function generateAutoSets(system: IntensitySystem): SetInfo[] {
  switch (system) {
    case "rpe":
      return [
        {
          reps: 8,
          rpe: 8,
          rest: 90,
          rir: null,
          one_rep_max_percent: null,
          set_type: "standard",
        },
        {
          reps: 8,
          rpe: 8,
          rest: 90,
          rir: null,
          one_rep_max_percent: null,
          set_type: "standard",
        },
      ];
    case "one_rep_max_percent":
      return [
        {
          reps: 6,
          one_rep_max_percent: 75,
          rest: 120,
          rpe: null,
          rir: null,
          set_type: "standard",
        },
        {
          reps: 6,
          one_rep_max_percent: 75,
          rest: 120,
          rpe: null,
          rir: null,
          set_type: "standard",
        },
      ];
    case "rir":
      return [
        {
          reps: 10,
          rir: 2,
          rest: 90,
          rpe: null,
          one_rep_max_percent: null,
          set_type: "standard",
        },
        {
          reps: 10,
          rir: 2,
          rest: 90,
          rpe: null,
          one_rep_max_percent: null,
          set_type: "standard",
        },
      ];
    case "none":
    default:
      return [
        {
          reps: 8,
          rest: 90,
          rpe: null,
          rir: null,
          one_rep_max_percent: null,
          set_type: "standard",
        },
      ];
  }
}
