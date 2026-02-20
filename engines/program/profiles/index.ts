/**
 * Program Goal Profiles — Registry
 * Purpose:
 *  Central access to per-goal profiles and a resolver with sane fallbacks.
 */

import type { Goal, ProgramSpec, WeeklyTargets } from "../../core/types";
import type { GoalProfile } from "./types";
import { HypertrophyProfile } from "./hypertrophy";
import { StrengthProfile } from "./strength";
import { AthleticProfile } from "./athletic";

const PROFILES: Record<Goal, GoalProfile> = {
  hypertrophy: HypertrophyProfile,
  strength: StrengthProfile,
  athletic: AthleticProfile,
  fat_loss: HypertrophyProfile, // fallback: volume bias + feasibility (tune later)
  endurance: AthleticProfile, // fallback: mixed intensity & spacing
  power: StrengthProfile, // power shares strength's heavy compound emphasis
};

export function getGoalProfile(goal: Goal): GoalProfile {
  return PROFILES[goal] ?? HypertrophyProfile;
}

/**
 * If the user didn't provide explicit targets, build them from the profile
 * (typically: apply one band to all priority muscles).
 */
export function resolveWeeklyTargets(
  spec: ProgramSpec
): WeeklyTargets | undefined {
  const profile = getGoalProfile(spec.goal);
  if (spec.targets?.setsPerMuscle) return spec.targets; // user already set them
  return profile.makeTargetsFromSpec?.(spec) ?? profile.weeklyTargets;
}
