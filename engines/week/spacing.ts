/**
 * Week Engine — Spacing Rules (sequence-based)
 * ------------------------------------------------------------
 * Purpose:
 *   Evaluate stress undulation without calendar days (slots only).
 *
 * Gotchas:
 *   - Add more rules as needed (e.g., same-pattern spacing).
 */

import { DayRole } from "../core/types";

/** Return human-readable flags describing spacing issues */
export function spacingFlagsForRoles(roles: DayRole[]): string[] {
  const flags: string[] = [];
  for (let i = 0; i < roles.length - 1; i++) {
    if (roles[i] === "High" && roles[i + 1] === "High") {
      flags.push(`Back-to-back High at slots ${i}–${i + 1}`);
    }
  }
  const highCountIn3 = (i: number) =>
    roles.slice(i, i + 3).filter((r) => r === "High").length;
  for (let i = 0; i < roles.length - 2; i++) {
    if (highCountIn3(i) > 2) flags.push(`>2 High in 3 slots starting at ${i}`);
  }
  return flags;
}
