export type SetInfo = {
  reps: number;
  rest: number; // in seconds
  rpe: number | null;
  rir: number | null;
  one_rep_max_percent: number | null;
};

export type WorkoutExercise = {
  id: string; // lookup back to full exercise data
  exercise_id: string;
  order_num: number;
  name: string;
  sets: SetInfo[]; // reps, rpe, rest, etc.
  notes?: string;
  intensity: IntensitySystem;
};

export type Workout = {
  exercises: WorkoutExercise[];
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
