import { MuscleType } from "react-body-highlighter";
import type {
  MuscleRegion,
  MuscleMovementType,
  MuscleRole,
} from "@/types/Exercise";

export type MuscleGroup =
  | "quads"
  | "glutes"
  | "hamstrings"
  | "back"
  | "chest"
  | "shoulders"
  | "arms"
  | "core"
  | "obliques"
  | "adductors"
  | "abductors"
  | "calves"
  | "rotator_cuff"
  | "hip_flexors";

export type Muscle = keyof typeof MUSCLE_DISPLAY_MAP;

export { MuscleRole };

export interface MuscleInfo {
  id: Muscle;
  displayName: string;
  region: MuscleRegion;
  movementType: MuscleMovementType;
  role?: MuscleRole;
  group?: MuscleGroup;
}

export const MUSCLES: MuscleInfo[] = [
  // --- Shoulders ---
  {
    id: "anterior_deltoid",
    displayName: "Anterior Deltoid",
    region: "upper",
    movementType: "push",
    group: "shoulders",
  },
  {
    id: "lateral_deltoid",
    displayName: "Lateral Deltoid",
    region: "upper",
    movementType: "abduction",
    group: "shoulders",
  },
  {
    id: "posterior_deltoid",
    displayName: "Posterior Deltoid",
    region: "upper",
    movementType: "pull",
    group: "shoulders",
  },

  // --- Arms ---
  {
    id: "biceps",
    displayName: "Biceps Brachii",
    region: "upper",
    movementType: "pull",
    group: "arms",
  },
  {
    id: "triceps_brachii",
    displayName: "Triceps Brachii",
    region: "upper",
    movementType: "push",
    group: "arms",
  },
  {
    id: "forearm",
    displayName: "Forearm",
    region: "upper",
    movementType: "neutral",
    group: "arms",
  },

  // --- Core ---
  {
    id: "core",
    displayName: "Core",
    region: "core",
    movementType: "neutral",
    group: "core",
  },

  // --- Back ---
  {
    id: "erector_spinae",
    displayName: "Erector Spinae",
    region: "upper",
    movementType: "pull",
    group: "back",
  },
  {
    id: "latissimus_dorsi",
    displayName: "Latissimus Dorsi",
    region: "upper",
    movementType: "pull",
    group: "back",
  },
  {
    id: "rhomboids",
    displayName: "Rhomboids",
    region: "upper",
    movementType: "pull",
    group: "back",
  },
  {
    id: "lower_traps",
    displayName: "Lower Trapezius",
    region: "upper",
    movementType: "pull",
    group: "back",
  },
  {
    id: "upper_traps",
    displayName: "Upper Trapezius",
    region: "upper",
    movementType: "pull",
    group: "back",
  },

  // --- Chest ---
  {
    id: "pectoralis_major",
    displayName: "Pectoralis Major",
    region: "upper",
    movementType: "push",
    group: "chest",
  },

  // --- Glutes ---
  {
    id: "gluteus_maximus",
    displayName: "Gluteus Maximus",
    region: "lower",
    movementType: "push",
    group: "glutes",
  },

  // --- Legs ---
  {
    id: "hamstrings",
    displayName: "Hamstrings",
    region: "lower",
    movementType: "pull",
    group: "hamstrings",
  },
  {
    id: "quadriceps",
    displayName: "Quadriceps",
    region: "lower",
    movementType: "push",
    group: "quads",
  },
  {
    id: "sartorius",
    displayName: "Sartorius",
    region: "lower",
    movementType: "neutral",
    group: "quads",
  },

  // --- Calves ---
  {
    id: "gastrocnemius",
    displayName: "Gastrocnemius",
    region: "lower",
    movementType: "push",
    group: "calves",
  },
  {
    id: "soleus",
    displayName: "Soleus",
    region: "lower",
    movementType: "push",
    group: "calves",
  },
  {
    id: "tibialis_anterior",
    displayName: "Tibialis Anterior",
    region: "lower",
    movementType: "neutral",
    group: "calves",
  },
  {
    id: "tibialis_posterior",
    displayName: "Tibialis Posterior",
    region: "lower",
    movementType: "neutral",
    group: "calves",
  },
  {
    id: "peroneus_brevis",
    displayName: "Peroneus Brevis",
    region: "lower",
    movementType: "neutral",
    group: "calves",
  },
  {
    id: "peroneus_longus",
    displayName: "Peroneus Longus",
    region: "lower",
    movementType: "neutral",
    group: "calves",
  },

  // --- Hip Flexors / Abductors ---
  {
    id: "tensor_fasciae_latae",
    displayName: "Tensor Fasciae Latae",
    region: "lower",
    movementType: "abduction",
    group: "abductors",
  },
  {
    id: "iliopsoas",
    displayName: "Iliopsoas",
    region: "lower",
    movementType: "pull",
    group: "hip_flexors",
  },
];

export const MUSCLE_DISPLAY_MAP = MUSCLES.reduce((acc, muscle) => {
  acc[muscle.id] = muscle.displayName;
  return acc;
}, {} as Record<string, string>);

export const MUSCLE_NAME_MAP: Record<string, Muscle> = {
  anterior_deltoid: MuscleType.FRONT_DELTOIDS,
  lateral_deltoid: MuscleType.FRONT_DELTOIDS,
  posterior_deltoid: MuscleType.BACK_DELTOIDS,

  biceps: MuscleType.BICEPS,
  triceps_brachii: MuscleType.TRICEPS,
  forearm: MuscleType.FOREARM,

  core: MuscleType.ABS,

  erector_spinae: MuscleType.LOWER_BACK,
  latissimus_dorsi: MuscleType.UPPER_BACK,
  rhomboids: MuscleType.UPPER_BACK,

  lower_traps: MuscleType.TRAPEZIUS,
  upper_traps: MuscleType.TRAPEZIUS,

  pectoralis_major: MuscleType.CHEST,

  gluteus_maximus: MuscleType.GLUTEAL,

  hamstrings: MuscleType.HAMSTRING,
  quadriceps: MuscleType.QUADRICEPS,
  sartorius: MuscleType.QUADRICEPS,

  gastrocnemius: MuscleType.CALVES,
  soleus: MuscleType.CALVES,
  tibialis_anterior: MuscleType.CALVES,
  tibialis_posterior: MuscleType.CALVES,
  peroneus_brevis: MuscleType.CALVES,
  peroneus_longus: MuscleType.CALVES,

  tensor_fasciae_latae: MuscleType.ABDUCTORS,
  iliopsoas: MuscleType.ABDUCTOR,
};

export const BACK_MUSCLES = [
  // Shoulders / Upper Back
  "posterior_deltoid",
  "rhomboids",
  "latissimus_dorsi",
  "erector_spinae",
  "lower_traps",
  "upper_traps",

  // Arms (posterior view)
  "triceps_brachii",
  "forearm",

  // Glutes & Legs
  "gluteus_maximus",
  "hamstrings",
  "gastrocnemius",
  "soleus",
  "tibialis_posterior",
  "peroneus_brevis",
  "peroneus_longus",
];

export const FRONT_MUSCLES = [
  // Shoulders / Chest
  "anterior_deltoid",
  "lateral_deltoid",
  "pectoralis_major",

  // Arms (front view)
  "biceps",
  "triceps_brachii",
  "forearm",

  // Core
  "core",
  "iliopsoas",
  "tensor_fasciae_latae",

  // Legs
  "quadriceps",
  "sartorius",
  "tibialis_anterior",
];
