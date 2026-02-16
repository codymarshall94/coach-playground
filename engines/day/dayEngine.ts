/**
 * Day Engine — computeDayMetrics
 * ------------------------------------------------------------
 * Purpose:
 *   Turn a planned session (slot) into explainable metrics:
 *   load, fatigue bars, energy mix, activation coverage, risk flags.
 *
 * Inputs:
 *   SessionInput (exercises, sets, optional intent)
 *
 * Outputs:
 *   DayMetrics (used by Week Engine + UI Session Overview)
 *
 * Gotchas:
 *   - sessionLoad is normalized to a 0-10 scale; Week Engine re-normalizes via z-score.
 *   - roleFinal respects user override (intent.role_intent).
 */

import { energyMixForSet } from "@/engines/day/energy";
import { fatigueFromExercise } from "@/engines/day/fatigue";
import { setRawLoad } from "@/engines/day/intensity";
import {
  DayMetrics,
  DayRole,
  EnergySystem,
  FatigueBreakdown,
  SessionInput,
} from "@/engines/main";

export function computeDayMetrics(input: SessionInput): DayMetrics {
  const { exercises, intent } = input;

  const rawLoads: number[] = [];
  let totalMinutes = 0;
  const muscleSets: Record<string, number> = {}; // weighted (effective)
  const muscleHits: Record<string, number> = {}; // raw set count
  const patternExposure: any = {};

  let fatigueAcc: FatigueBreakdown = { cns: 0, metabolic: 0, joint: 0 };
  let energyAcc: Record<EnergySystem, number> = {
    ATP_CP: 0,
    Glycolytic: 0,
    Oxidative: 0,
  };

  for (const se of exercises) {
    // track exposure to movement patterns
    const cat = se.exercise.category;
    patternExposure[cat] = (patternExposure[cat] ?? 0) + 1;

    // translate sets into “effective sets” per muscle using activation_map
    const setCount = se.sets.length;
    for (const em of se.exercise.exercise_muscles ?? []) {
      const mId = em.muscles?.id;
      const contrib = em.contribution ?? 0;
      if (!mId || contrib <= 0) continue;

      // raw (each set counts fully)
      muscleHits[mId] = (muscleHits[mId] ?? 0) + setCount;

      // effective (weighted by contribution)
      muscleSets[mId] = (muscleSets[mId] ?? 0) + setCount * contrib;
    }

    // accumulate per-set load/time/energy
    for (const s of se.sets) {
      rawLoads.push(setRawLoad(s, intent?.density_intent));
      const timeUnderTension = s.reps * 3; // ~3s/rep average tempo
      totalMinutes += (timeUnderTension + (s.rest ?? 120)) / 60;
      const em = energyMixForSet(s);
      energyAcc.ATP_CP += em.ATP_CP;
      energyAcc.Glycolytic += em.Glycolytic;
      energyAcc.Oxidative += em.Oxidative;
    }

    // heuristic fatigue per exercise
    const f = fatigueFromExercise(se.exercise, se.sets);
    fatigueAcc.cns += f.cns;
    fatigueAcc.metabolic += f.metabolic;
    fatigueAcc.joint += f.joint;
  }

  const rawLoad = rawLoads.reduce((a, c) => a + c, 0);

  // Normalize to 0-10 scale.
  // A "reference moderate session" has ~5 exercises, each ~3 sets of 10 reps
  // at RPE 7-8 => rawLoad per set ~= reps * intensityFactor * densityFactor
  //           ~= 10 * 0.75 * 1.0 = 7.5.  15 sets => rawLoad ~ 112.
  // We want that to land at ~5 on a 0-10 scale, so divisor ~ 22.
  const sessionLoad = Math.min(10, rawLoad / 22);

  const exCount = Math.max(1, exercises.length);
  const fatigue: FatigueBreakdown = {
    cns: fatigueAcc.cns / exCount,
    metabolic: fatigueAcc.metabolic / exCount,
    joint: fatigueAcc.joint / exCount,
  };
  const energySum =
    energyAcc.ATP_CP + energyAcc.Glycolytic + energyAcc.Oxidative || 1;
  const energy = {
    ATP_CP: energyAcc.ATP_CP / energySum,
    Glycolytic: energyAcc.Glycolytic / energySum,
    Oxidative: energyAcc.Oxidative / energySum,
  };

  // Provisional role; refined by Week Engine z-score
  let roleComputed: DayRole =
    sessionLoad >= 7 ? "High" : sessionLoad <= 3 ? "Low" : "Medium";
  const roleFinal: DayRole = input.intent?.role_intent ?? roleComputed;

  const riskFlags: string[] = [];
  if (fatigue.joint >= 70) riskFlags.push("High joint load");
  if (fatigue.cns >= 75) riskFlags.push("High CNS demand");
  if (totalMinutes > (input.timeCapMin ?? 90)) riskFlags.push("Over time cap");

  return {
    sessionLoad,
    rawLoad,
    estDurationMin: Math.round(totalMinutes),
    roleComputed,
    roleFinal,
    fatigue,
    energy,
    muscleSets,
    muscleSetHits: muscleHits,
    patternExposure,
    riskFlags,
  };
}
