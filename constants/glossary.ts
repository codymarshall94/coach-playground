export type GlossaryTerm = {
  key: string;
  label: string;
  definition: string;
  category: string;
};

export const GLOSSARY_TERMS = [
  {
    key: "sagittal",
    label: "Sagittal Plane",
    definition:
      "The sagittal plane divides the body into left and right halves. Movements in this plane include forward and backward motions like squats or lunges.",
    category: "Movement Plane",
  },
  {
    key: "frontal",
    label: "Frontal Plane",
    definition:
      "The frontal plane divides the body into front and back halves. Movements in this plane include lateral motions like side lunges or lateral raises.",
    category: "Movement Plane",
  },
  {
    key: "axial",
    label: "Axial Load",
    definition:
      "An axial load compresses the spine vertically, often from a barbell placed on the back or shoulders (e.g., barbell back squat).",
    category: "Load Profile",
  },
  {
    key: "horizontal_load",
    label: "Horizontal Load",
    definition:
      "A load applied parallel to the floor, often seen in movements like hip thrusts or rows.",
    category: "Load Profile",
  },
  {
    key: "ascending",
    label: "Ascending Strength Curve",
    definition:
      "A strength curve where the movement gets easier as you reach the top (e.g., squats or bench press).",
    category: "Force Curve",
  },
  {
    key: "bell",
    label: "Bell Curve Strength",
    definition:
      "The exercise is hardest in the middle portion (e.g., hip thrusts).",
    category: "Force Curve",
  },
  {
    key: "flat",
    label: "Flat Strength Curve",
    definition:
      "The resistance stays consistent throughout the full range of motion.",
    category: "Force Curve",
  },
  {
    key: "compound",
    label: "Compound Movement",
    definition:
      "A compound exercise works multiple joints and muscle groups (e.g., squats, deadlifts).",
    category: "Exercise Type",
  },
  {
    key: "unilateral",
    label: "Unilateral Movement",
    definition:
      "Exercises performed with one limb at a time (e.g., Bulgarian split squat).",
    category: "Exercise Type",
  },
  {
    key: "ballistic",
    label: "Ballistic Movement",
    definition:
      "An explosive movement that requires speed and momentum (e.g., kettlebell swing, Olympic lifts).",
    category: "Exercise Type",
  },
  {
    key: "romRating",
    label: "Range of Motion (ROM)",
    definition:
      "Describes how much joint movement an exercise allows — long, medium, or short.",
    category: "Mechanics",
  },
  {
    key: "forceCurve",
    label: "Force Curve",
    definition:
      "The strength profile of an exercise over its range of motion — ascending, bell, or flat.",
    category: "Mechanics",
  },
  {
    key: "recoveryDays",
    label: "Recovery Days",
    definition: "Indicates how many days to rest between sets of an exercise.",
    category: "Difficulty",
  },
  {
    key: "fatigue",
    label: "Fatigue",
    definition:
      "Indicates how much stress an exercise places on your central nervous system. High fatigue can require longer recovery.",
    category: "Difficulty",
  },
  {
    key: "romRating",
    label: "Range of Motion (ROM)",
    definition:
      "Describes how much joint movement an exercise allows — long, medium, or short.",
    category: "Mechanics",
  },
  {
    key: "skillRequirement",
    label: "Skill Level",
    definition:
      "Indicates how much experience or coordination is needed — low (beginner), moderate, or high (advanced).",
    category: "Difficulty",
  },
  {
    key: "cnsDemand",
    label: "CNS Demand",
    definition:
      "Measures how much stress an exercise places on your central nervous system. High CNS demand can require longer recovery.",
    category: "Fatigue Metrics",
  },
  {
    key: "metabolicDemand",
    label: "Metabolic Demand",
    definition:
      "Indicates how energy-intensive an exercise is, often influencing conditioning or fatiguing quickly.",
    category: "Fatigue Metrics",
  },
  {
    key: "jointStress",
    label: "Joint Stress",
    definition:
      "Describes how stressful the exercise is on connective tissues and joints.",
    category: "Fatigue Metrics",
  },
];
