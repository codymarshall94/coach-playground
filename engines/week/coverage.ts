/**
 * Week Engine — Coverage Aggregation
 * ------------------------------------------------------------
 * Purpose:
 *   Sum “effective sets” per muscle across projected work slots.
 */

import { DayMetrics } from "../core/types";

/** Sum muscle sets across day metrics */
export function volumeByMuscleFromDays(
  days: DayMetrics[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of days) {
    for (const [m, v] of Object.entries(d.muscleSets)) {
      out[m] = (out[m] ?? 0) + v;
    }
  }
  return out;
}
