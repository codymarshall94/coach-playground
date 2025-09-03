/**
 * Strength Profile
 * Purpose:
 *  Maximize heavy exposures with adequate technique volume. Lower total
 *  sets per muscle than hypertrophy; stronger spacing protection.
 */

import type { GoalProfile } from "./types";

export const StrengthProfile: GoalProfile = {
  id: "strength",
  copy: {
    label: "Strength",
    overview:
      "Emphasizes heavy exposures (≥80–85%1RM) with supportive volume. Targets ~6–12 effective sets per priority muscle.",
    coachingTone: "direct",
  },

  // Strength cares more about intensity fit, progression, and stress patterning
  weights: {
    intensityFit: 0.25,
    progression: 0.2,
    stressPatterning: 0.2,
    volumeFit: 0.1,
  },

  defaultTargetBandForPriorityMuscle: [6, 12],

  roleMix: { high: 0.3, medium: 0.5, low: 0.2 },

  intensity: {
    desired: { high: 0.3, moderate: 0.45, low: 0.25 },
    minimums: { high: 0.25 }, // need some heavy
    maximums: { high: 0.67 }, // don’t let High dominate
  },

  spacing: { maxHighIn3: 2, forbidHHAdjacent: true }, // protect CNS/joints

  balance: {
    pushPull: [0.8, 1.3], // slightly looser than hypertrophy
    quadHam: [0.8, 1.3],
    upperLower: [0.8, 1.3],
  },
};
