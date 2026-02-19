export type SetType =
  | "warmup"
  | "standard"
  | "amrap"
  | "drop"
  | "cluster"
  | "myo_reps"
  | "rest_pause"
  | "top_set"
  | "backoff";

export type DayType = "workout" | "rest" | "active_rest" | "other";

export type WorkoutExerciseGroupType =
  | "standard"
  | "superset"
  | "giant_set"
  | "circuit";

export type ProgramGoal = "strength" | "hypertrophy" | "endurance" | "power";

export type IntensitySystem = "rpe" | "one_rep_max_percent" | "rir" | "none";

export type WorkoutTypes =
  | "strength"
  | "hypertrophy"
  | "endurance"
  | "power"
  | "balance"
  | "other";

export type RepSchemeType =
  | "fixed"
  | "range"
  | "time"
  | "each_side"
  | "amrap"
  | "distance";

// -----------------------------------------------------------------------------
// CORE STRUCTURES
// -----------------------------------------------------------------------------

export type SetInfo = {
  reps: number;
  /** Upper bound for rep ranges (e.g. reps=8, reps_max=12 → "8-12") */
  reps_max?: number;
  rest: number;
  rpe: number | null;
  rir: number | null;
  one_rep_max_percent: number | null;

  set_type: SetType;

  /** Duration in seconds — used when tracking_type is "time" */
  duration?: number;
  /** Whether this set is per-side (e.g., 12 reps each leg) */
  per_side?: boolean;
  /** Distance in meters — used when tracking_type is "distance" */
  distance?: number;

  /** Per-set rep scheme (fixed, time, each_side, amrap) */
  rep_scheme?: RepSchemeType;

  // Optional dynamic fields for special set types
  drop_percent?: number;
  drop_sets?: number;

  cluster_reps?: number;
  intra_rest?: number;

  activation_set_reps?: number;
  mini_sets?: number;

  initial_reps?: number;
  pause_duration?: number;

  notes?: string;
  params?: Record<string, any>; // optional JSON blob for advanced settings
};

export type WorkoutExercise = {
  id: string;
  exercise_id: string;
  order_num: number;
  display_name: string;
  sets: SetInfo[];
  notes?: string;
  intensity: IntensitySystem;
  /** How the "reps" column is interpreted for this exercise */
  rep_scheme?: RepSchemeType;
};

export type WorkoutExerciseGroup = {
  id: string;
  type: WorkoutExerciseGroupType;
  rest_after_group?: number;
  order_num: number;
  notes?: string;
  exercises: WorkoutExercise[];
};

// -----------------------------------------------------------------------------
// PROGRAM STRUCTURE
// -----------------------------------------------------------------------------

export type ProgramDay = {
  id: string;
  name: string;
  block_id?: string;
  week_id?: string;
  description: string;
  order_num: number;
  type: DayType;
  groups: WorkoutExerciseGroup[];
};

export type ProgramWeek = {
  id: string;
  weekNumber: number;
  label?: string;
  days: ProgramDay[];
};

export type ProgramBlock = {
  id: string;
  name: string;
  order_num: number;
  description?: string;
  /** @deprecated Use weeks array length instead. Kept for backward compat during migration. */
  weekCount?: number;
  weeks: ProgramWeek[];
  /** @deprecated Use weeks[n].days instead. Kept for backward compat during migration. */
  days: ProgramDay[];
};

export type Program = {
  id: string;
  name: string;
  description: string;
  goal: ProgramGoal;
  mode: "days" | "blocks";
  cover_image?: string | null;
  blocks?: ProgramBlock[];
  days?: ProgramDay[];
  created_at: Date;
  updated_at: Date;
};

// -----------------------------------------------------------------------------
// CONVENIENCE TYPES
// -----------------------------------------------------------------------------

export type NewProgramDay = Omit<ProgramDay, "id">;
export type NewProgram = Omit<Program, "id">;
export type NewProgramBlock = Omit<ProgramBlock, "id">;
