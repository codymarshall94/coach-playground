export interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  category: ExerciseCategory;
  movement_plane: MovementPlane;
  load_profile: LoadProfile;
  equipment: Equipment[];
  skill_requirement: SkillRequirement;
  compound: boolean;
  unilateral: boolean;
  ballistic: boolean;
  rom_rating: RomRating; // short, medium, long
  force_curve: ForceCurve;
  ideal_rep_range: [number, number];
  intensity_ceiling: number; // 0-1 (% of true 1 RM attainable)
  fatigue_index: number; // 0-1 overall
  cns_demand: number; // 0-1
  metabolic_demand: number; // 0-1
  joint_stress: number; // 0-1
  recovery_days: number; // typical after hard session
  base_calorie_cost: number; // kcals per hard set (est.)
  energy_system: EnergySystem;
  volume_per_set: { strength: number; hypertrophy: number }; // kg-reps
  cues: string[];
  // variations: ExerciseVariation[];
  contra_indications: string[];
  external_links: { label: string; url: string }[];
  image_url: string;
  exercise_muscles: ExerciseMuscleJoined[] | null;
}

export type MuscleRole = "prime" | "synergist" | "stabilizer" | null;

export type MuscleRow = {
  id: string;
  display_name: string;
  group_name: string | null;
};

export type ExerciseMuscleJoined = {
  role: MuscleRole;
  contribution: number | null;
  muscles: MuscleRow;
};

export type SkillRequirement = "low" | "moderate" | "high";

export type MovementPlane = "sagittal" | "frontal" | "transverse";

export type LoadProfile =
  | "axial"
  | "vertical"
  | "horizontal"
  | "rotational"
  | "mixed";

export type ForceCurve = "ascending" | "descending" | "bell" | "flat";

export type RomRating = "short" | "medium" | "long";

export type EnergySystem = "ATP-CP" | "Glycolytic" | "Oxidative";

export type Equipment =
  | "barbell"
  | "rack"
  | "bench"
  | "box"
  | "pause"
  | "bar"
  | "kettlebell"
  | "cable"
  | "dumbbell"
  | "machine"
  | "bodyweight"
  | "other";

export type ExerciseType =
  | "compound"
  | "isolation"
  | "accessory"
  | "warmup"
  | "cooldown";

export type ExerciseCategory =
  | "squat"
  | "hinge"
  | "lunge"
  | "push_horizontal"
  | "push_vertical"
  | "pull_horizontal"
  | "pull_vertical"
  | "hinge_horizontal"
  | "carry"
  | "jump"
  | "brace"
  | "other";
