/**
 * Athletic Profile
 * Purpose:
 *  Mixed strength/size with movement quality and conditioning. Requires
 *  balanced intensity, good spacing, and moderate weekly set targets.
 */

import type { GoalProfile } from "./types";

export const AthleticProfile: GoalProfile = {
  id: "athletic",
  copy: {
    label: "Athletic",
    overview:
      "Blends force, speed, and capacity. Balanced intensity mix with solid spacing and moderate volume per priority muscle.",
    coachingTone: "gentle",
  },

  // Stress patterning matters most; keep intensity/volume balanced
  weights: {
    stressPatterning: 0.25,
    intensityFit: 0.15,
    progression: 0.15,
    volumeFit: 0.15,
  },

  defaultTargetBandForPriorityMuscle: [8, 14],

  roleMix: { high: 0.2, medium: 0.55, low: 0.25 },

  intensity: {
    desired: { high: 0.2, moderate: 0.5, low: 0.3 },
    minimums: { high: 0.15, moderate: 0.35 },
    maximums: { high: 0.6 },
  },

  spacing: { maxHighIn3: 2, forbidHHAdjacent: true },

  balance: {
    pushPull: [0.85, 1.2],
    quadHam: [0.85, 1.2],
    upperLower: [0.9, 1.15],
  },
};
