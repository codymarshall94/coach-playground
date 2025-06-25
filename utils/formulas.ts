// One-rep max (Epley formula)
export const calculateOneRepMax = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

// Wilks coefficient (classic male/female formulas, 1987)
export const calculateWilksScore = (
  bodyweightKg: number,
  totalLiftedKg: number,
  sex: "male" | "female"
): number => {
  const coeffs =
    sex === "male"
      ? [
          -216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6,
          -1.291e-8,
        ]
      : [
          594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913,
          4.731582e-5, -9.054e-8,
        ];

  const [a, b, c, d, e, f] = coeffs;
  const bw = bodyweightKg;
  const denom =
    a + b * bw + c * bw ** 2 + d * bw ** 3 + e * bw ** 4 + f * bw ** 5;

  return (totalLiftedKg * 500) / denom;
};

// Volume (basic)
export const calculateVolume = (
  sets: number,
  reps: number,
  weight: number
): number => {
  return sets * reps * weight;
};

// Estimated fatigue score (simple model)
export const calculateFatigueScore = (rpe: number, reps: number): number => {
  return (rpe / 10) * reps;
};

// Intensity (percent of 1RM)
export const calculateIntensity = (weight: number, oneRM: number): number => {
  return (weight / oneRM) * 100;
};

// Estimated tonnage per session
export const calculateSessionTonnage = (
  exercises: { sets: number; reps: number; weight: number }[]
) => {
  return exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * ex.weight, 0);
};
