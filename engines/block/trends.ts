/**
 * Block Engine — Trend Helpers
 * ------------------------------------------------------------
 * Purpose:
 *   Provide small helpers for block-level trend and deload logic.
 */

import { avg } from "../core/utils/math";

/** Compare first vs last third → rising / flat / falling */
export function trend3(values: number[]): "rising" | "flat" | "falling" {
  if (values.length < 3) return "flat";
  const a = avg(values.slice(0, Math.floor(values.length / 3)));
  const c = avg(values.slice(Math.floor((2 * values.length) / 3)));
  const eps = 0.05 * (avg(values) || 1);
  if (c - a > eps) return "rising";
  if (a - c > eps) return "falling";
  return "flat";
}
