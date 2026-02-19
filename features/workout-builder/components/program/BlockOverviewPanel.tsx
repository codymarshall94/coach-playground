"use client";

import type { ProgramBlock } from "@/types/Workout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useExercises } from "@/hooks/useExercises";
import { analyzeWorkoutDay } from "@/utils/analyzeWorkoutDay";
import { BarChart2, Activity, Hash, Layers, ArrowUp, ArrowDown } from "lucide-react";

function sumDayReps(day: any) {
  let reps = 0;
  for (const g of day.groups ?? []) {
    for (const ex of g.exercises ?? []) {
      for (const s of ex.sets ?? []) {
        reps += (s.reps ?? 0) * (s.per_side ? 2 : 1);
      }
    }
  }
  return reps;
}

function isNonDecreasing(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

export default function BlockOverviewPanel({
  block,
  onClose,
  onOpenWeek,
}: {
  block: ProgramBlock;
  onClose: () => void;
  onOpenWeek: (weekIndex: number) => void;
}) {
  const { data: allExercises = [] } = useExercises();

  const weeks = block.weeks ?? [];

  const summaries = useMemo(() => {
    return weeks.map((week) => {
      let totalVolume = 0;
      let intensitySum = 0;
      let intensityCount = 0;
      let totalSets = 0;
      let totalReps = 0;

      for (const day of week.days ?? []) {
        if (day.type === "workout") {
          try {
            const wm = analyzeWorkoutDay(day.groups ?? [], allExercises);
            totalVolume += wm.totalVolume ?? 0;
            if (wm.avgFatigue !== undefined) {
              intensitySum += wm.avgFatigue;
              intensityCount += 1;
            }
            totalSets += wm.total_sets ?? 0;
          } catch (e) {
            // ignore individual day analysis failures
          }
        }
        // always sum reps from sets to handle varying exercises
        totalReps += sumDayReps(day);
      }

      const avgIntensity = intensityCount ? Math.round((intensitySum / intensityCount) * 10) / 10 : 0;
      const avgRepsPerSet = totalSets ? Math.round((totalReps / totalSets) * 10) / 10 : 0;
      return { totalVolume, avgIntensity, totalSets, totalReps, avgRepsPerSet };
    });
  }, [weeks, allExercises]);

  const percentChange = (cur: number, prev: number | undefined) => {
    if (!prev || prev === 0) return null;
    return Math.round(((cur - prev) / prev) * 100);
  };

  const overallLinear = useMemo(() => {
    const vols = summaries.map((s) => s.totalVolume);
    const ints = summaries.map((s) => s.avgIntensity);
    const sets = summaries.map((s) => s.totalSets);
    return isNonDecreasing(vols) && isNonDecreasing(ints) && isNonDecreasing(sets);
  }, [summaries]);

  return (
    <div className="p-4 w-full sm:max-w-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{block.name || "Block Overview"}</h3>
          <p className="text-sm text-muted-foreground">Week totals, averages and progression check.</p>
          <div className="mt-2">
            <div className={cn(
              "inline-block px-2 py-1 rounded-md text-sm font-medium",
              overallLinear ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            )}>
              {overallLinear ? "Linear progression" : "Non-linear progression"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* SheetContent already renders a close 'X' in the top-right. */}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        {summaries.map((s, i) => {
          const prev = summaries[i - 1];
          const volChange = percentChange(s.totalVolume, prev?.totalVolume);
          const intChange = percentChange(s.avgIntensity, prev?.avgIntensity);
          const repsChange = percentChange(s.totalReps, prev?.totalReps);
          const setsChange = percentChange(s.totalSets, prev?.totalSets);
          return (
            <button
              key={i}
              onClick={() => onOpenWeek(i)}
              className="p-3 rounded-lg bg-card border border-slate-100 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">W{i + 1}</div>
                  <Badge variant="secondary" className="text-xs">{s.totalSets} sets</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Click to open week</div>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Reps</div>
                    <div className="font-medium">{s.totalReps}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Avg / set</div>
                    <div className="font-medium">{s.avgRepsPerSet}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Volume</div>
                    <div className="font-medium">{Math.round(s.totalVolume)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Intensity</div>
                    <div className="font-medium">{s.avgIntensity}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">Trends</div>
                  <div className="flex items-center gap-1">
                    {volChange !== null && (
                      <span className={cn(volChange > 0 ? "text-emerald-600" : volChange < 0 ? "text-destructive" : "text-muted-foreground", "flex items-center gap-1 text-xs")}>
                        {volChange > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(volChange)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">Prog</div>
                  <div className="font-medium text-sm">
                    {(() => {
                      if (volChange === null) return "—";
                      if (volChange > 0) return "▲";
                      if (volChange < 0) return "▼";
                      return "—";
                    })()}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
