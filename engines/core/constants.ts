/**
 * PRGRM Engine — Shared Constants
 * ------------------------------------------------------------
 * Purpose:
 *   Centralize default weights, versioning, and muscle groupings.
 *
 * Gotchas:
 *   - These are defaults; allow per-goal overrides in profiles if needed.
 *   - MUSCLE_GROUPS is a convenience for balance ratios; align with your taxonomy.
 */

import type { Goal } from "./types";

export const ENGINE_VERSION = "1.0.0";

/** Default weights by goal used in Program Engine scoring */
export const GOAL_WEIGHTS: Record<
  Goal,
  {
    specificity: number;
    progression: number;
    stressPatterning: number;
    volumeFit: number;
    intensityFit: number;
    balanceHealth: number;
    feasibility: number;
  }
> = {
  strength: {
    specificity: 0.2,
    progression: 0.2,
    stressPatterning: 0.2,
    volumeFit: 0.1,
    intensityFit: 0.2,
    balanceHealth: 0.05,
    feasibility: 0.05,
  },
  hypertrophy: {
    specificity: 0.2,
    progression: 0.15,
    stressPatterning: 0.15,
    volumeFit: 0.3,
    intensityFit: 0.1,
    balanceHealth: 0.1,
    feasibility: 0.1,
  },
  athletic: {
    specificity: 0.2,
    progression: 0.15,
    stressPatterning: 0.25,
    volumeFit: 0.1,
    intensityFit: 0.15,
    balanceHealth: 0.1,
    feasibility: 0.05,
  },
  fat_loss: {
    specificity: 0.15,
    progression: 0.1,
    stressPatterning: 0.2,
    volumeFit: 0.2,
    intensityFit: 0.1,
    balanceHealth: 0.15,
    feasibility: 0.1,
  },
  endurance: {
    specificity: 0.2,
    progression: 0.15,
    stressPatterning: 0.2,
    volumeFit: 0.15,
    intensityFit: 0.15,
    balanceHealth: 0.05,
    feasibility: 0.1,
  },
  power: {
    specificity: 0.2,
    progression: 0.2,
    stressPatterning: 0.2,
    volumeFit: 0.1,
    intensityFit: 0.2,
    balanceHealth: 0.05,
    feasibility: 0.05,
  },
};

export const RECOMMENDED_MINUTES_BAND: Record<
  "strength" | "hypertrophy" | "endurance" | "power",
  [number, number] // per week
> = {
  strength: [150, 240],
  hypertrophy: [180, 300],
  endurance: [200, 360],
  power: [150, 240],
};

export const DEFAULT_SET_BAND_BY_GOAL: Record<
  "strength" | "hypertrophy" | "endurance" | "power",
  [number, number] // per muscle / week (effective sets)
> = {
  strength: [6, 12],
  hypertrophy: [10, 20],
  endurance: [8, 16],
  power: [6, 12],
};

export const LOW_ATTENTION_THRESHOLD = 3; // sets/wk → flag muscle as “low attention”

/** Convenience muscle groupings for balance ratios (tune to your taxonomy) */
export const MUSCLE_GROUPS = {
  push: ["pecs", "front_delts", "triceps"],
  pull: ["lats", "mid_back", "rear_delts", "biceps"],
  quads: ["quads"],
  hams: ["hamstrings", "glutes"],
  upper: [
    "shoulders",
    "chest",
    "back",
    "biceps",
    "triceps",
    "forearms",
    "lats",
    "mid_back",
    "rear_delts",
    "front_delts",
    "pecs",
  ],
  lower: ["quads", "hamstrings", "glutes", "adductors", "calves"],
};
