export type SetInfo = {
  reps: number;
  rest: number; // in seconds
  rpe?: number;
  rir?: number;
  oneRepMaxPercent?: number;
};

export type WorkoutExercise = {
  id: string; // lookup back to full exercise data
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

export type IntensitySystem = "rpe" | "oneRepMaxPercent" | "rir" | "none";

export type WorkoutTypes =
  | "strength"
  | "hypertrophy"
  | "endurance"
  | "power"
  | "balance"
  | "other";
