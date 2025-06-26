export type WorkoutSummaryStats = {
  totalVolume: number;
  avgFatigue: number;
  movementFocus: Record<string, number>;
  avgCNS: number;
  avgMet: number;
  avgJoint: number;
  systemBreakdown: Record<string, number>;
  topMuscles: [string, number][];
  avgRecovery: number;
  maxRecovery: number;
};
