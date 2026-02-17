import type {
  IntensitySystem,
  SetInfo,
  SetType,
  WorkoutExercise,
} from "@/types/Workout";
import { v4 as uuidv4 } from "uuid";

type BuildExerciseOptions = {
  notes?: string;
  reps?: number; // default 10
  rest?: number; // default 60 sec
  rpe?: number | null; // default 8 when intensity='rpe'
  set_type?: SetType; // default 'standard'
  sets?: number; // default 3
};

/**
 * Create a WorkoutExercise object that matches your new types + schema.
 * - Uses display_name (not name)
 * - Returns independent set objects
 */
export function buildExercise(
  exercise_id: string,
  display_name: string,
  order_num: number,
  intensity: IntensitySystem = "rpe",
  opts: BuildExerciseOptions = {}
): WorkoutExercise {
  const {
    notes = "",
    reps = 10,
    rest = 60,
    rpe = intensity === "rpe" ? 8 : null,
    set_type = "standard",
    sets = 3,
  } = opts;

  const intensityDefaults = (): Pick<
    SetInfo,
    "rpe" | "rir" | "one_rep_max_percent"
  > => {
    switch (intensity) {
      case "rpe":
        return { rpe: rpe ?? 8, rir: null, one_rep_max_percent: null };
      case "one_rep_max_percent":
        return { rpe: null, rir: null, one_rep_max_percent: 75 };
      case "rir":
        return { rpe: null, rir: 2, one_rep_max_percent: null };
      case "none":
      default:
        return { rpe: null, rir: null, one_rep_max_percent: null };
    }
  };

  return {
    id: uuidv4(),
    exercise_id,
    order_num,
    display_name,
    intensity,
    notes,
    sets: Array.from({ length: sets }, () => ({
      reps,
      rest,
      set_type,
      notes,
      params: {},
      ...intensityDefaults(),
    })),
  };
}
