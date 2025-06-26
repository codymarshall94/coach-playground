import { Muscle } from "@/types/Workout";

export interface MuscleInfo {
  id: Muscle;
  displayName: string;
  region: "upper" | "lower" | "core";
  movementType: "push" | "pull" | "neutral";
  role?: "prime" | "support" | "stabilizer";
  group?: string; // e.g. "quads", "delts", "posterior chain"
}

export const MUSCLES: MuscleInfo[] = [
  {
    id: "forearms",
    displayName: "Forearms",
    region: "upper",
    movementType: "neutral",
    role: "support",
    group: "arms",
  },
  {
    id: "peroneus_brevis",
    displayName: "Peroneus Brevis",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "calves",
  },
  {
    id: "quadriceps",
    displayName: "Quadriceps",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "quads",
  },
  {
    id: "hamstrings",
    displayName: "Hamstrings",
    region: "lower",
    movementType: "pull",
    role: "prime",
    group: "posterior_chain",
  },
  {
    id: "gluteus_maximus",
    displayName: "Gluteus Maximus",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "posterior_chain",
  },
  {
    id: "pectoralis_major",
    displayName: "Pectoralis Major",
    region: "upper",
    movementType: "push",
    role: "prime",
    group: "chest",
  },
  {
    id: "latissimus_dorsi",
    displayName: "Latissimus Dorsi",
    region: "upper",
    movementType: "pull",
    role: "prime",
    group: "back",
  },
  {
    id: "biceps",
    displayName: "Biceps",
    region: "upper",
    movementType: "pull",
    role: "support",
    group: "arms",
  },
  {
    id: "triceps_brachii",
    displayName: "Triceps Brachii",
    region: "upper",
    movementType: "push",
    role: "support",
    group: "arms",
  },
  {
    id: "core",
    displayName: "Core",
    region: "core",
    movementType: "neutral",
    role: "stabilizer",
  },
  {
    id: "erector_spinae",
    displayName: "Erector Spinae",
    region: "core",
    movementType: "pull",
    role: "stabilizer",
    group: "posterior_chain",
  },
  {
    id: "anterior_deltoid",
    displayName: "Anterior Deltoid",
    region: "upper",
    movementType: "push",
    role: "prime",
    group: "delts",
  },
  {
    id: "lateral_deltoid",
    displayName: "Lateral Deltoid",
    region: "upper",
    movementType: "push",
    role: "prime",
    group: "delts",
  },
  {
    id: "upper_traps",
    displayName: "Upper Traps",
    region: "upper",
    movementType: "push",
    role: "prime",
    group: "delts",
  },
  {
    id: "rhomboids",
    displayName: "Rhomboids",
    region: "upper",
    movementType: "pull",
    role: "prime",
    group: "back",
  },
  {
    id: "posterior_deltoid",
    displayName: "Posterior Deltoid",
    region: "upper",
    movementType: "push",
    role: "prime",
    group: "delts",
  },

  {
    id: "lower_traps",
    displayName: "Lower Traps",
    region: "upper",
    movementType: "push",
    role: "prime",
    group: "delts",
  },
  {
    id: "sartorius",
    displayName: "Sartorius",
    region: "lower",
    movementType: "pull",
    role: "prime",
    group: "posterior_chain",
  },
  {
    id: "tensor_fasciae_latae",
    displayName: "Tensor Fasciae Latae",
    region: "lower",
    movementType: "pull",
    role: "prime",
    group: "posterior_chain",
  },
  {
    id: "vastus_lateralis",
    displayName: "Vastus Lateralis",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "quads",
  },
  {
    id: "vastus_medialis",
    displayName: "Vastus Medialis",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "quads",
  },
  {
    id: "vastus_intermedius",
    displayName: "Vastus Intermedius",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "quads",
  },
  {
    id: "rectus_femoris",
    displayName: "Rectus Femoris",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "quads",
  },
  {
    id: "iliopsoas",
    displayName: "Iliopsoas",
    region: "lower",
    movementType: "pull",
    role: "prime",
    group: "posterior_chain",
  },
  {
    id: "gastrocnemius",
    displayName: "Gastrocnemius",
    region: "lower",
    movementType: "pull",
    role: "prime",
    group: "calves",
  },
  {
    id: "soleus",
    displayName: "Soleus",
    region: "lower",
    movementType: "pull",
    role: "prime",
    group: "calves",
  },
  {
    id: "tibialis_anterior",
    displayName: "Tibialis Anterior",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "calves",
  },
  {
    id: "tibialis_posterior",
    displayName: "Tibialis Posterior",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "calves",
  },
  {
    id: "peroneus_longus",
    displayName: "Peroneus Longus",
    region: "lower",
    movementType: "push",
    role: "prime",
    group: "calves",
  },
];

// const usedMuscles = new Set<string>();
// EXERCISES.forEach((exercise) => {
//   Object.keys(exercise.activationMap || {}).forEach((muscle) => {
//     usedMuscles.add(muscle);
//   });
// });

// const definedMuscles = new Set<string>(MUSCLES.map((m) => m.id));
// console.log(definedMuscles);

// const musclesToAdd = Array.from(usedMuscles).filter(
//   (muscle) => !definedMuscles.has(muscle)
// );

// console.log(musclesToAdd);

export const MUSCLE_DISPLAY_MAP: Record<Muscle, string> = {
  quadriceps: "Quadriceps",
  gluteus_maximus: "Gluteus Maximus",
  hamstrings: "Hamstrings",
  erector_spinae: "Erector Spinae",
  core: "Core",
  pectoralis_major: "Pectoralis Major",
  triceps_brachii: "Triceps Brachii",
  anterior_deltoid: "Anterior Deltoid",
  lateral_deltoid: "Lateral Deltoid",
  upper_traps: "Upper Traps",
  latissimus_dorsi: "Latissimus Dorsi",
  rhomboids: "Rhomboids",
  posterior_deltoid: "Posterior Deltoid",
  biceps: "Biceps",
  forearms: "Forearms",
  lower_traps: "Lower Traps",
  sartorius: "Sartorius",
  tensor_fasciae_latae: "Tensor Fasciae Latae",
  vastus_lateralis: "Vastus Lateralis",
  vastus_medialis: "Vastus Medialis",
  vastus_intermedius: "Vastus Intermedius",
  rectus_femoris: "Rectus Femoris",
  iliopsoas: "Iliopsoas",
  gastrocnemius: "Gastrocnemius",
  soleus: "Soleus",
  tibialis_anterior: "Tibialis Anterior",
  tibialis_posterior: "Tibialis Posterior",
  peroneus_longus: "Peroneus Longus",
  peroneus_brevis: "Peroneus Brevis",
  // ...etc
};
