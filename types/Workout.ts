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
  | "balance";

// -----------------------------------------------------------------------------
// CORE STRUCTURES
// -----------------------------------------------------------------------------

export type SetInfo = {
  reps: number;
  rest: number;
  rpe: number | null;
  rir: number | null;
  one_rep_max_percent: number | null;

  set_type: SetType;

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
  description: string;
  order_num: number;
  type: DayType;
  groups: WorkoutExerciseGroup[];
};

export type ProgramBlock = {
  id: string;
  name: string;
  order_num: number;
  description?: string;
  weeks?: number;
  days: ProgramDay[];
};

export type Program = {
  id: string;
  name: string;
  description: string;
  goal: ProgramGoal;
  mode: "days" | "blocks";
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
