export const FIELD_INFO = {
  ETL: {
    label: "Estimated Training Load",
    description:
      "An estimate of how demanding an exercise is, factoring in reps, intensity, and movement difficulty. Helps gauge total training stress.",
  },
  totalReps: {
    label: "Total Reps",
    description:
      "The total number of reps performed in all sets of an exercise. Helps gauge total volume.",
  },
  cnsDemand: {
    label: "CNS Demand",
    description:
      "Represents the neurological fatigue caused by maximal intent or heavy loading.",
  },
  metabolicDemand: {
    label: "Metabolic Demand",
    description:
      "Refers to the 'burn' or cellular fatigue from longer sets or short rest.",
  },
  jointStress: {
    label: "Joint Stress",
    description:
      "Mechanical stress on joints and connective tissues from range, loading, or angles.",
  },
  romRating: {
    label: "Range of Motion",
    description:
      "How much the exercise takes a muscle through its length. Longer ROM = better hypertrophy.",
  },
  forceCurve: {
    label: "Force Curve",
    description:
      "Where in the movement most resistance is. E.g., squats are harder at the bottom (ascending curve).",
  },
  loadProfile: {
    label: "Load Profile",
    description:
      "Direction and type of load — axial (through spine), horizontal, or rotational.",
  },
  energySystem: {
    label: "Energy System",
    description:
      "Dominant physiological energy system: ATP-PC (short bursts), Glycolytic (1-3 min), Oxidative (endurance).",
  },
  recoveryDays: {
    label: "Recovery Days",
    description: "Indicates how many days to rest between sets of an exercise.",
  },
  baseCalorieCost: {
    label: "Base Calorie Cost",
    description:
      "Indicates how many calories an exercise burns per rep. This is the base calorie cost of the exercise, which is used to calculate the total calorie cost of the exercise.",
  },
};

export type FieldInfo = keyof typeof FIELD_INFO;
