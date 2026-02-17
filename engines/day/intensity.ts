/**
 * Day Engine — Intensity & Density Heuristics
 * ------------------------------------------------------------
 * Purpose:
 *   Convert RPE/%1RM + rest/set-type into a per-set “load multiplier”.
 *
 * Gotchas:
 *   - Heuristics are intentionally simple and tunable.
 *   - Centralize numbers here so you can calibrate without touching engines.
 */

import { SetInfo, SessionIntent } from "../core/types";

/** Map %1RM/RPE to an intensity factor (0.5..1.0) */
export function intensityFactor(set: SetInfo): number {
  if (set.one_rep_max_percent != null) {
    const p = set.one_rep_max_percent;
    // 60%→~0.5, 90%+→1.0 (clamped)
    return Math.max(0.5, Math.min(1.0, ((p - 60) / 30) * 0.5 + 0.5));
  }
  if (set.rpe != null) {
    const r = set.rpe;
    // RPE6→~0.65, RPE9.5→1.0 (clamped)
    return Math.max(0.65, Math.min(1.0, ((r - 6) / 3.5) * 0.35 + 0.65));
  }
  // Unknown intensity → assume moderate
  return 0.75;
}

/** Adjust load based on rest time and special set methods */
export function densityFactor(
  set: SetInfo,
  densityIntent?: SessionIntent["density_intent"]
): number {
  const rest = set.rest ?? 120;
  let base = rest <= 60 ? 1.15 : rest <= 90 ? 1.05 : rest <= 150 ? 1.0 : 0.95;
  if (densityIntent === "short_rests") base *= 1.05;
  if (set.set_type === "amrap") base *= 1.08;
  if (set.set_type === "cluster") base *= 1.07;
  if (set.set_type === "rest_pause" || set.set_type === "myo_reps")
    base *= 1.06;
  return base;
}

/** Per-set raw load proxy (reps × intensity × density) */
export function setRawLoad(
  set: SetInfo,
  densityIntent?: SessionIntent["density_intent"]
): number {
  return set.reps * intensityFactor(set) * densityFactor(set, densityIntent);
}
