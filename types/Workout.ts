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
  | "tempo"
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

export type Muscle =
  | "quadriceps"
  | "gluteus_maximus"
  | "hamstrings"
  | "erector_spinae"
  | "core"
  | "pectoralis_major"
  | "triceps_brachii"
  | "anterior_deltoid"
  | "lateral_deltoid"
  | "upper_traps"
  | "lower_traps"
  | "latissimus_dorsi"
  | "rhomboids"
  | "posterior_deltoid"
  | "biceps"
  | "forearms"
  | "sartorius"
  | "tensor_fasciae_latae"
  | "vastus_lateralis"
  | "vastus_medialis"
  | "vastus_intermedius"
  | "rectus_femoris"
  | "iliopsoas"
  | "gastrocnemius"
  | "soleus"
  | "tibialis_anterior"
  | "tibialis_posterior"
  | "peroneus_longus"
  | "peroneus_brevis";

export type ExerciseVariation =
  | "high-bar"
  | "low-bar"
  | "paused"
  | "tempo"
  | "box"
  | "close-grip"
  | "diamond"
  | "band-resisted"
  | "depth jump"
  | "single-leg"
  | "low box"
  | "seated"
  | "push-press"
  | "tempo eccentric"
  | "deficit"
  | "incline"
  | "decline"
  | "pendlay"
  | "underhand"
  | "safety bar"
  | "half-kneeling"
  | "standing"
  | "1-arm"
  | "single-leg"
  | "pause reps"
  | "banded"
  | "half-kneeling"
  | "standing"
  | "1-arm"
  | "depth jump"
  | "single-leg"
  | "low box"
  | "seated"
  | "push-press"
  | "tempo eccentric"
  | "deficit"
  | "side plank"
  | "plank with reach"
  | "elevated feet"
  | "weighted"
  | "with reach"
  | "elevated feet"
  | "hands on hips"
  | "with arm swing"
  | "with reach"
  | "elevated feet"
  | "weighted"
  | "with reach"
  | "in-place"
  | "single-arm"
  | "neutral"
  | "alternating"
  | "hammer curl"
  | "preacher curl"
  | "rope"
  | "straight bar"
  | "reverse grip"
  | "alternating"
  | "box to box"
  | "with hurdle"
  | "in place"
  | "depth-tuck"
  | "rebound series";

export type PrimaryMover = number;
export type SecondaryMover = number;
export type LowSecondaryMover = number;
export type IncidentalMover = number;

export type ActivationMap = Partial<Record<Muscle, number>>;

export type WorkoutTypes =
  | "strength"
  | "hypertrophy"
  | "endurance"
  | "power"
  | "balance"
  | "other";

export interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  category: ExerciseCategory;
  movementPlane: MovementPlane;
  loadProfile: LoadProfile;
  equipment: Equipment[];
  skillRequirement: SkillRequirement;
  compound: boolean;
  unilateral: boolean;
  ballistic: boolean;
  romRating: RomRating; // short, medium, long
  forceCurve: ForceCurve;
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
  activationMap: ActivationMap; // 0-1 per muscle
  energySystem: EnergySystem;
  volumePerSetEstimate: { strength: number; hypertrophy: number }; // kg-reps
  cues: string[];
  variations: ExerciseVariation[];
  contraIndications: string[];
  externalLinks: { label: string; url: string }[];
}
