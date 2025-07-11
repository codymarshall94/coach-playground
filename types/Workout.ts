export type SetType =
  | "standard"
  | "amrap"
  | "drop"
  | "cluster"
  | "myo_reps"
  | "rest_pause";

export type SetInfo = {
  reps: number;
  rest: number;
  rpe: number | null;
  rir: number | null;
  one_rep_max_percent: number | null;

  set_type: SetType; //Standard is default

  // Optional dynamic fields for special set types
  drop_percent?: number;
  drop_sets?: number;

  cluster_reps?: number;
  intra_rest?: number;

  activation_set_reps?: number;
  mini_sets?: number;

  initial_reps?: number;
  pause_duration?: number;

  notes?: string; // custom notes per set
};

export type WorkoutExercise = {
  id: string;
  exercise_id: string;
  order_num: number;
  name: string;
  sets: SetInfo[]; // reps, rpe, rest, etc.
  notes?: string;
  intensity: IntensitySystem;
};

export type WorkoutExerciseGroup = {
  id: string;
  type: "standard" | "superset" | "giant_set" | "circuit"; // extensible
  rest_after_group?: number; // rest in seconds
  order_num: number;
  notes?: string;
  exercises: WorkoutExercise[];
};

export type Workout = {
  exercise_groups: WorkoutExerciseGroup[];
  createdAt: Date;
  updatedAt: Date;
};

export type DayType = "workout" | "rest" | "active_rest" | "other";

export type ProgramBlock = {
  id: string;
  name: string;
  order: number;
  description?: string;
  weeks?: number; // Optional: useful for labeling (e.g., "Weeks 1-4")
  days: ProgramDay[];
};

export type ProgramDay = {
  id: string;
  name: string;
  block_id?: string;
  description: string;
  workout: Workout[];
  order: number;
  type: DayType;
};

export type ProgramGoal = "strength" | "hypertrophy" | "endurance" | "power";

export type Program = {
  id: string;
  name: string;
  description: string;
  goal: ProgramGoal;
  mode: "days" | "blocks";
  blocks?: ProgramBlock[];
  days?: ProgramDay[];
  createdAt: Date;
  updatedAt: Date;
};

export type NewProgramDay = Omit<ProgramDay, "id">;
export type NewProgram = Omit<Program, "id">;
export type NewProgramBlock = Omit<ProgramBlock, "id">;

export type IntensitySystem = "rpe" | "one_rep_max_percent" | "rir" | "none";

export type WorkoutTypes =
  | "strength"
  | "hypertrophy"
  | "endurance"
  | "power"
  | "balance"
  | "other";
