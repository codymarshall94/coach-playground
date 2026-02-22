/**
 * Main Orchestrator — computeAll
 * ------------------------------------------------------------
 * Purpose:
 *   Single entrypoint that stitches Day → Week → Block → Program.
 *   Keeps app code simple: pass spec + sequence, get all metrics.
 *
 * Structured mode:
 *   When `blocks` is provided the engine computes real per-week and
 *   per-block metrics from the actual program data instead of
 *   duplicating a single projected week.
 *
 * Flat mode (legacy / days-mode):
 *   When only `sequence` is provided the engine builds a single
 *   honest block containing one week — no fake duplication.
 */

import { computeBlockMetrics } from "../block/blockEngine";
import {
  BlockMetrics,
  DayMetrics,
  ProgramMetrics,
  ProgramSpec,
  SessionInput,
  WeekMetrics,
} from "../core/types";
import { computeDayMetrics } from "../day/dayEngine";
import { computeProgramMetrics } from "../program/programEngine";
import { computeWeekFromSequence } from "../week/weekEngine";

/** A block of weeks, each week being a list of sessions */
export interface BlockInput {
  weeks: SessionInput[][];
}

export type EngineInput = {
  spec: ProgramSpec;
  /** Flat session list — used for the day-level UI panel and as
   *  fallback when `blocks` is not provided. */
  sequence: SessionInput[];
  /** Structured block→week→session data from a real program.
   *  When present, block and program metrics are computed from
   *  actual multi-week data instead of single-week projections. */
  blocks?: BlockInput[];
};

export type EngineOutput = {
  days: DayMetrics[];
  week: WeekMetrics;
  block?: BlockMetrics;
  program?: ProgramMetrics;
};

/** Compute all layers from a program spec + sequence of sessions */
export function computeAll(input: EngineInput): EngineOutput {
  const { spec, sequence } = input;

  // ── Day layer (flat — for per-day UI panels) ──
  const days: DayMetrics[] = sequence.map((s) => computeDayMetrics(s));

  // ── Week layer (from flat sequence — used by insights panel) ──
  const week = computeWeekFromSequence(days, spec.targets);

  // ── Block + Program layers (from structured data when available) ──
  let blockMetrics: BlockMetrics | undefined;
  let programMetrics: ProgramMetrics | undefined;

  if (input.blocks && input.blocks.length > 0) {
    // ---- Structured mode: real per-week, per-block computation ----
    const allBlockMetrics: BlockMetrics[] = input.blocks.map(
      (blockInput, bi) => {
        const weekMetricsList: WeekMetrics[] = blockInput.weeks.map(
          (weekSessions, wi) => {
            const weekDays = weekSessions.map((s) => computeDayMetrics(s));
            const wm = computeWeekFromSequence(weekDays, spec.targets);
            return { ...wm, weekIndex: wi };
          }
        );

        const bm = computeBlockMetrics(weekMetricsList);
        return { ...bm, blockIndex: bi };
      }
    );

    blockMetrics = allBlockMetrics[allBlockMetrics.length - 1];
    programMetrics = computeProgramMetrics(spec, allBlockMetrics);
  } else {
    // ---- Flat / days-mode: single honest block with one week ----
    const singleBlock = computeBlockMetrics([week]);
    blockMetrics = singleBlock;
    programMetrics = computeProgramMetrics(spec, [singleBlock]);
  }

  return { days, week, block: blockMetrics, program: programMetrics };
}

