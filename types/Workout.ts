import { EnergySystemType } from "@/constants/energy-systems";

export type SetInfo = {
  reps: number;
  weight: number;
  rest: number; // in seconds
  rpe?: number;
};

export type WorkoutExercise = {
  id: string; // lookup back to full exercise data
  name: string;
  sets: SetInfo[]; // reps, weight, rest, etc.
};

export type Workout = {
  exercises: WorkoutExercise[];
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  category: string; // high-level pattern
  movementPlane: "sagittal" | "frontal" | "transverse";
  loadProfile: "axial" | "vertical" | "horizontal" | "rotational" | "mixed";
  equipment: string[];
  skillRequirement: "low" | "moderate" | "high";
  compound: boolean;
  unilateral: boolean;
  ballistic: boolean;
  romRating: "short" | "medium" | "long";
  forceCurve: "ascending" | "descending" | "bell" | "flat";
  idealRepRange: [number, number];
  intensityCeiling: number; // 0-1 (% of true 1 RM attainable)
  fatigue: {
    index: number; // 0-1 overall
    cnsDemand: number; // 0-1
    metabolicDemand: number; // 0-1
    jointStress: number; // 0-1
  };
  recoveryDays: number; // typical after hard session
  baseCalorieCost: number; // kcals per hard set (est.)
  primaryMuscles: string[];
  secondaryMuscles: string[];
  activationMap: Record<string, number>; // 0-1 per muscle
  energySystem: EnergySystemType;
  volumePerSetEstimate: { strength: number; hypertrophy: number }; // kg-reps
  cues: string[];
  variations: string[];
  contraIndications: string[];
  externalLinks: { label: string; url: string }[];
}
