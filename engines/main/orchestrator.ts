/**
 * Main Orchestrator — computeAll
 * ------------------------------------------------------------
 * Purpose:
 *   Single entrypoint that stitches Day → Week → Block → Program.
 *   Keeps app code simple: pass spec + sequence, get all metrics.
 *
 * Modes:
 *   - Runtime (future): swap week engine for rolling-7d aggregator.
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

export type EngineInput = {
  spec: ProgramSpec;
  sequence: SessionInput[]; // ordered slots (calendar-free)
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

  // Day layer
  const days: DayMetrics[] = sequence.map((s) => computeDayMetrics(s));

  // Week projection (calendar-free)
  const week = computeWeekFromSequence(days, spec.targets);

  // Optional block/program projections (for planning UIs)
  let block: BlockMetrics | undefined;
  const weeks = Array.from({ length: 4 }, () => week);
  block = computeBlockMetrics(weeks);

  let program: ProgramMetrics | undefined;

  const blocks = Array.from({ length: 4 }, () => block);
  program = computeProgramMetrics(spec, blocks);

  return { days, week, block, program };
}
