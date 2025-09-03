/**
 * Hypertrophy Profile
 * Purpose:
 *  Muscle gain focus — volume-first, moderate intensity dominance,
 *  balanced movement coverage, sensible weekly set band per priority muscle.
 */

import type { GoalProfile } from "./types";

export const HypertrophyProfile: GoalProfile = {
  id: "hypertrophy",
  copy: {
    label: "Hypertrophy",
    overview:
      "Prioritizes weekly volume at moderate intensity with balanced movement patterns. Targets 10–20 effective sets per priority muscle.",
    coachingTone: "gentle",
  },

  // Slightly higher emphasis on volume fit; still care about spacing/progression
  weights: { volumeFit: 0.35, intensityFit: 0.1, specificity: 0.2 },

  defaultTargetBandForPriorityMuscle: [10, 20],

  roleMix: { high: 0.15, medium: 0.65, low: 0.2 },

  intensity: {
    desired: { moderate: 0.55, high: 0.15, low: 0.3 },
    minimums: { moderate: 0.5 },
    maximums: { high: 0.5 }, // avoid too many grinders
  },

  spacing: { maxHighIn3: 2, forbidHHAdjacent: true },

  balance: {
    pushPull: [0.8, 1.25],
    quadHam: [0.8, 1.25],
    upperLower: [0.85, 1.2],
  },
};
