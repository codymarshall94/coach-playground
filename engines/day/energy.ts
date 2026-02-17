/**
 * Day Engine — Energy System Mix
 * ------------------------------------------------------------
 * Purpose:
 *   Roughly categorize a set’s energy demand into ATP-CP/Glycolytic/Oxidative.
 *
 * Gotchas:
 *   - Very coarse; used for athlete-style programs and user education.
 */

import { EnergySystem, SetInfo } from "@/engines/main";

/** Return energy system proportions that sum ≈ 1 */
export function energyMixForSet(set: SetInfo): Record<EnergySystem, number> {
  const reps = set.reps;
  const rest = set.rest ?? 120;
  let atp = 0,
    gly = 0,
    ox = 0;

  if (reps <= 3 && rest >= 120) {
    atp = 0.7;
    gly = 0.25;
    ox = 0.05;
  } else if (reps <= 6) {
    atp = 0.45;
    gly = 0.45;
    ox = 0.1;
  } else if (reps <= 12) {
    atp = 0.2;
    gly = 0.6;
    ox = 0.2;
  } else {
    atp = 0.1;
    gly = 0.45;
    ox = 0.45;
  }

  if (rest <= 60) {
    gly += 0.08;
    ox += 0.05;
    atp -= 0.13;
  }
  const sum = atp + gly + ox || 1;
  return { ATP_CP: atp / sum, Glycolytic: gly / sum, Oxidative: ox / sum };
}
