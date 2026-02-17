/**
 * Week Engine — Balance Ratios
 * ------------------------------------------------------------
 * Purpose:
 *   Compute push:pull, quad:ham, upper:lower ratios from volume map.
 */

import {
  pushPullRatio,
  quadHamRatio,
  upperLowerRatio,
} from "../core/utils/taxonomy";

export function balanceRatios(volumeByMuscle: Record<string, number>) {
  return {
    pushPull: pushPullRatio(volumeByMuscle),
    quadHam: quadHamRatio(volumeByMuscle),
    upperLower: upperLowerRatio(volumeByMuscle),
  };
}
