/**
 * Day Engine — Fatigue Heuristic
 * ------------------------------------------------------------
 * Purpose:
 *   Produce explainable fatigue bars (CNS / Metabolic / Joint) per exercise.
 * - ex.cns_demand, ex.metabolic_demand, ex.joint_stress are 0..1 in DB
 * - adds bonuses from the way sets are programmed (heavy, high reps, short rest)
 * - returns 0..100 per channel so UI can show X/10 by dividing by 10
 * -
 *
 * Gotchas:
 *   - High-level heuristic; NOT a medical/physiology model.
 *   - Use for coaching feedback and spacing rules, not medical advice.
 */

import { avg } from "@/engines/core/utils/math";
import { FatigueBreakdown, SetInfo } from "@/engines/main";
import { Exercise } from "@/types/Exercise";

export function fatigueFromExercise(
  ex: Exercise,
  sets: SetInfo[]
): FatigueBreakdown {
  // ---- set-context signals -------------------------------------------------
  // one_rep_max_percent is 0..100, RPE ~ 1..10, rest in seconds
  const avgPct = avg(sets.map((s) => s.one_rep_max_percent ?? 0));
  const avgRPE = avg(sets.map((s) => s.rpe ?? 0));
  const avgRest = avg(sets.map((s) => s.rest ?? 120));
  const avgReps = avg(sets.map((s) => s.reps ?? 0));

  const heavy = avgPct >= 80 || avgRPE >= 8.5 ? 1 : 0; // 0/1 flag
  const highRep = avgReps >= 12 ? 1 : 0; // hypertrophy / density emphasis
  const shortRest = avgRest <= 60 ? 1 : 0; // glycolytic bias / fatigue

  // ---- DB meta come in as 0..1 (normalize safely) --------------------------
  const cnsMeta = Math.max(0, Math.min(1, ex.cns_demand ?? 0));
  const metMeta = Math.max(0, Math.min(1, ex.metabolic_demand ?? 0));
  const jointMeta = Math.max(0, Math.min(1, ex.joint_stress ?? 0));

  // ---- base from DB (scaled to percent) ------------------------------------
  // Weight the meta strongly (x60) so the exercise identity matters,
  // then layer set-context bonuses.
  let cnsBase = 60 * cnsMeta; // 0..60
  let metBase = 60 * metMeta; // 0..60
  let jointBase = 50 * jointMeta; // 0..50 (kept slightly lower so load profile matters)

  // ---- bonuses from set context --------------------------------------------
  cnsBase += 25 * heavy; // heavy singles/triples, complex lifts
  metBase += 25 * highRep + 15 * shortRest;
  jointBase += heavy ? 10 : 0; // heavier work increases joint stress

  // load-profile heuristic: vertical > horizontal > rotational > mixed/other
  const lpBonus =
    ex.load_profile === "vertical"
      ? 35
      : ex.load_profile === "horizontal"
      ? 20
      : ex.load_profile === "rotational"
      ? 10
      : 5;
  jointBase += lpBonus;

  // ballistic / skillful lifts nudge CNS & metabolic a touch
  if (ex.ballistic) {
    cnsBase += 5;
    metBase += 5;
  }
  if (ex.skill_requirement === "high") {
    cnsBase += 5;
  }

  // ---- clamp to 0..100 and return -----------------------------------------
  const clamp100 = (x: number) => Math.max(0, Math.min(100, x));

  return {
    cns: clamp100(cnsBase),
    metabolic: clamp100(metBase),
    joint: clamp100(jointBase),
  };
}
