/**
 * PRGRM Engine — Math Utilities
 * ------------------------------------------------------------
 * Purpose:
 *   Small, pure helpers used across engines. Keep dependency-free.
 *
 * Gotchas:
 *   - Avoid adding domain logic here; keep it generic math only.
 */

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sum = (arr: number[]) => arr.reduce((a, c) => a + c, 0);
export const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);

export const stddev = (arr: number[]) => {
  const m = avg(arr);
  return Math.sqrt(avg(arr.map((x) => (x - m) * (x - m))));
};

/** z-score with safe divide for zero stddev */
export const zScore = (x: number, mean: number, sd: number) =>
  sd === 0 ? 0 : (x - mean) / sd;

/** 3-part trend check (begin vs end), tolerant to noise */
export function trend3(arr: number[]): "rising" | "flat" | "falling" {
  if (arr.length < 3) return "flat";
  const a = avg(arr.slice(0, Math.floor(arr.length / 3)));
  const c = avg(arr.slice(Math.floor((2 * arr.length) / 3)));
  const eps = 0.05 * (avg(arr) || 1);
  if (c - a > eps) return "rising";
  if (a - c > eps) return "falling";
  return "flat";
}
