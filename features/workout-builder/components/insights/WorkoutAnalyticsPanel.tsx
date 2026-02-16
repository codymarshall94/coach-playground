"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CATEGORY_DISPLAY_MAP } from "@/constants/movement-category";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import { DayMetrics } from "@/engines/main";
import { cn } from "@/lib/utils";
import { WorkoutExerciseGroup } from "@/types/Workout";
import {
  Activity,
  ArrowDown,
  ArrowLeftRight,
  ArrowUpDown,
  BarChart2,
  Brain,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Layers,
  Zap,
} from "lucide-react";

import MuscleHeatmap from "@/components/MuscleHeatmap";
import ScoreDial from "@/components/ScoreDial";
import { getAllExercises } from "@/services/exerciseService";
import { Exercise } from "@/types/Exercise";
import { useQuery } from "@tanstack/react-query";

/* ─── Constants ──────────────────────────────────────────── */

export const MOVEMENT_ICONS: Record<string, React.ReactNode> = {
  push_vertical: <ArrowUpDown className="w-3.5 h-3.5" />,
  push_horizontal: <ArrowLeftRight className="w-3.5 h-3.5" />,
  pull_horizontal: <ArrowLeftRight className="w-3.5 h-3.5 rotate-180" />,
  pull_vertical: <ArrowUpDown className="w-3.5 h-3.5 rotate-180" />,
  hinge: <ArrowDown className="w-3.5 h-3.5" />,
  lunge: <ArrowDown className="w-3.5 h-3.5" />,
  squat: <ArrowDown className="w-3.5 h-3.5" />,
};

const PUSH = ["push_horizontal", "push_vertical"] as const;
const PULL = ["pull_horizontal", "pull_vertical"] as const;
const LOWER = ["squat", "hinge", "lunge"] as const;
const UPPER = [...PUSH, ...PULL] as const;

/* ─── Helpers ────────────────────────────────────────────── */

function sumKeys(rec: Record<string, number>, keys: readonly string[]) {
  return keys.reduce((s, k) => s + (rec[k] ?? 0), 0);
}

function deriveWorkoutType(p: Record<string, number>) {
  const lower = sumKeys(p, LOWER);
  const upper = sumKeys(p, UPPER);
  if (lower > 0 && upper > 0) return "Full Body";
  if (lower > 0) return "Lower";
  if (upper > 0) return "Upper";
  return "Other";
}

function getLoadLabel(load: number) {
  if (load < 1.5) return { label: "Recovery", color: "bg-load-low/20 text-load-low" };
  if (load < 3) return { label: "Light", color: "bg-load-low/20 text-load-low" };
  if (load < 4.5) return { label: "Moderate", color: "bg-load-medium/20 text-load-medium" };
  if (load < 6) return { label: "Challenging", color: "bg-load-high/20 text-load-high" };
  if (load < 8) return { label: "Hard", color: "bg-load-max/20 text-load-max" };
  return { label: "Max Effort", color: "bg-destructive/20 text-destructive" };
}

function dialColor(load: number): string {
  if (load < 3) return "oklch(0.70 0.15 150)";
  if (load < 4.5) return "oklch(0.78 0.16 95)";
  if (load < 6) return "oklch(0.72 0.17 70)";
  if (load < 8) return "oklch(0.64 0.19 30)";
  return "oklch(0.58 0.22 25)";
}

function fatigueLabel(v: number) {
  if (v < 40) return "Low";
  if (v < 70) return "Mod";
  return "High";
}
function fatigueColor(v: number) {
  if (v < 40) return "text-load-low";
  if (v < 70) return "text-load-medium";
  return "text-load-max";
}
function fatigueBarColor(v: number) {
  if (v < 40) return "bg-load-low";
  if (v < 70) return "bg-load-medium";
  return "bg-load-max";
}

const ENERGY_ICON: Record<string, React.ReactNode> = {
  ATP_CP: <Heart className="w-3.5 h-3.5" />,
  Glycolytic: <Zap className="w-3.5 h-3.5" />,
  Oxidative: <Flame className="w-3.5 h-3.5" />,
};

const ENERGY_BAR: Record<string, string> = {
  ATP_CP: "bg-load-low",
  Glycolytic: "bg-load-medium",
  Oxidative: "bg-load-high",
};

/* ─── Component ──────────────────────────────────────────── */

interface Props {
  workout: WorkoutExerciseGroup[];
  dayMetrics: DayMetrics;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const WorkoutAnalyticsPanel = ({
  workout,
  dayMetrics,
  open,
  setOpen,
}: Props) => {
  const { data: exercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getAllExercises() as Promise<Exercise[]>,
  });

  const allExercises = workout.flatMap((g) => g.exercises);

  if (allExercises.length === 0) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Summary
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md p-6">
          <div className="grid place-items-center h-full text-center">
            <div className="space-y-2">
              <Dumbbell className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Add exercises to see your day summary.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  /* ── Derived metrics ──────────────────────── */
  const load = dayMetrics.sessionLoad;
  const { label: loadLabel, color: loadColor } = getLoadLabel(load);
  const durationMin = Math.ceil(dayMetrics.estDurationMin);

  const totalSets = allExercises.reduce((s, e) => s + (e.sets?.length ?? 0), 0);
  const totalExercises = allExercises.length;

  const movementFocus = dayMetrics.patternExposure;
  const workoutType = deriveWorkoutType(movementFocus);

  const pushPullRatio = (() => {
    const push = sumKeys(movementFocus, PUSH);
    const pull = sumKeys(movementFocus, PULL);
    if (!push && !pull) return 1;
    return (push || 1) / (pull || 1);
  })();

  const upperLowerRatio = (() => {
    const lower = sumKeys(movementFocus, LOWER);
    const upper = sumKeys(movementFocus, UPPER);
    if (!lower && !upper) return 1;
    return (lower || 1) / (upper || 1);
  })();

  const muscleVolumes = dayMetrics.muscleSets;
  const muscleSetCounts = dayMetrics.muscleSetHits;
  const maxVolume = Math.max(1, ...Object.values(muscleVolumes));

  const topMuscles = Object.entries(muscleVolumes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const muscleCount = Object.keys(muscleVolumes).length;

  /* Fatigue */
  const cns = dayMetrics.fatigue.cns;
  const met = dayMetrics.fatigue.metabolic;
  const joint = dayMetrics.fatigue.joint;

  /* Energy */
  const energyEntries = Object.entries(dayMetrics.energy ?? {});
  const energyTotal = energyEntries.reduce((s, [, v]) => s + (v ?? 0), 0) || 1;
  const energyParts = energyEntries.map(([k, v]) => ({
    key: k,
    percent: Math.max(0, Math.min(100, (v / energyTotal) * 100)),
  }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4" />
          Summary
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto w-full sm:max-w-md p-0">
        {/* ── Header ─────────────────────────────── */}
        <SheetHeader className="px-6 pt-6 pb-0">
          <SheetTitle className="text-title text-foreground">
            Day Summary
          </SheetTitle>
        </SheetHeader>

        {/* ═══════════════════════════════════════════
            TIER 1 — At-a-Glance Hero
            ═══════════════════════════════════════════ */}
        <section className="px-6 pt-5 pb-4 space-y-5">
          {/* Load dial + label */}
          <div className="flex items-center gap-5">
            <ScoreDial
              value={load * 10}
              size={72}
              thickness={7}
              fillColor={dialColor(load)}
              ariaLabel={`Training load ${load.toFixed(1)} out of 10`}
            >
              <span className="text-lg font-semibold tabular-nums">
                {load.toFixed(1)}
              </span>
            </ScoreDial>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Training Load
                </span>
                <Badge
                  className={cn(
                    "text-xs font-medium rounded-full px-2 py-0.5",
                    loadColor
                  )}
                >
                  {loadLabel}
                </Badge>
              </div>
              <p className="text-meta">
                How taxing this session is on your body overall.
              </p>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-4 gap-3">
            <QuickStat
              icon={<Dumbbell className="w-4 h-4" />}
              value={totalExercises}
              label="Exercises"
            />
            <QuickStat
              icon={<Layers className="w-4 h-4" />}
              value={totalSets}
              label="Sets"
            />
            <QuickStat
              icon={<Clock className="w-4 h-4" />}
              value={`${durationMin}m`}
              label="Duration"
            />
            <QuickStat
              icon={<Activity className="w-4 h-4" />}
              value={workoutType}
              label="Focus"
              small
            />
          </div>

          {/* Top muscles mini-preview */}
          {topMuscles.length > 0 && (
            <div className="space-y-2">
              <p className="text-meta font-medium uppercase tracking-wide">
                Top Muscles ({muscleCount} total)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {topMuscles.map(([id]) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="rounded-full text-xs font-normal bg-secondary/60"
                  >
                    {MUSCLE_DISPLAY_MAP[id as keyof typeof MUSCLE_DISPLAY_MAP] ??
                      id.replace(/[_-]/g, " ")}
                  </Badge>
                ))}
                {muscleCount > 5 && (
                  <Badge
                    variant="outline"
                    className="rounded-full text-xs font-normal"
                  >
                    +{muscleCount - 5}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </section>

        <div className="h-px bg-border" />

        {/* ═══════════════════════════════════════════
            TIER 2 — Deep Dive (Accordion)
            ═══════════════════════════════════════════ */}
        <Accordion
          type="multiple"
          className="px-6 pb-8"
          defaultValue={["muscles"]}
        >
          {/* ── Muscle Coverage ────────────────────── */}
          <AccordionItem value="muscles">
            <AccordionTrigger className="text-sm font-medium py-4">
              <span className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-muted-foreground" />
                Muscle Coverage
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5 space-y-4">
              <MuscleHeatmap
                mode="workout"
                workoutExercises={allExercises}
                exercises={exercises ?? []}
                muscle_volumes={muscleVolumes}
                muscle_set_counts={muscleSetCounts}
                maxVolume={maxVolume}
                workout={workout}
                height={320}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Fatigue Breakdown ──────────────────── */}
          <AccordionItem value="fatigue">
            <AccordionTrigger className="text-sm font-medium py-4">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-muted-foreground" />
                Fatigue Breakdown
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="space-y-3">
                <FatigueBar label="CNS" value={cns} icon={<Brain className="w-3.5 h-3.5" />} desc="Neural load from heavy or complex lifts" />
                <FatigueBar label="Metabolic" value={met} icon={<Heart className="w-3.5 h-3.5" />} desc="Energy system stress from volume" />
                <FatigueBar label="Joint" value={joint} icon={<Activity className="w-3.5 h-3.5" />} desc="Structural strain on joints" />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── Movement Balance ──────────────────── */}
          <AccordionItem value="balance">
            <AccordionTrigger className="text-sm font-medium py-4">
              <span className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                Movement Balance
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5 space-y-5">
              {/* Ratio pills */}
              <div className="grid grid-cols-2 gap-3">
                <RatioPill label="Push / Pull" value={pushPullRatio} />
                <RatioPill label="Upper / Lower" value={upperLowerRatio} />
              </div>

              {/* Movement pattern list */}
              <div className="space-y-1.5">
                <p className="text-meta font-medium uppercase tracking-wide">
                  Pattern Breakdown
                </p>
                <ul className="space-y-1">
                  {Object.entries(movementFocus)
                    .filter(([, count]) => count > 0)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, count]) => {
                      const label =
                        CATEGORY_DISPLAY_MAP[
                          cat as keyof typeof CATEGORY_DISPLAY_MAP
                        ] ?? cat;
                      const icon = MOVEMENT_ICONS[cat];
                      return (
                        <li
                          key={cat}
                          className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <span className="text-muted-foreground">{icon}</span>
                            <span className="capitalize">{label}</span>
                          </div>
                          <span className="text-sm tabular-nums font-medium text-muted-foreground">
                            {count}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── Energy Systems ─────────────────────── */}
          <AccordionItem value="energy">
            <AccordionTrigger className="text-sm font-medium py-4">
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-muted-foreground" />
                Energy Systems
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5 space-y-3">
              {/* Stacked bar */}
              <div className="h-3 rounded-full overflow-hidden flex bg-muted">
                {energyParts.map((p) => (
                  <div
                    key={p.key}
                    className={cn("h-full", ENERGY_BAR[p.key] ?? "bg-muted-foreground")}
                    style={{ width: `${p.percent}%` }}
                    title={`${p.key}: ${p.percent.toFixed(0)}%`}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {energyParts.map((p) => (
                  <div
                    key={p.key}
                    className="flex items-center gap-1.5 text-muted-foreground"
                  >
                    {ENERGY_ICON[p.key]}
                    <span className="font-medium text-foreground">
                      {p.key === "ATP_CP" ? "ATP-CP" : p.key}
                    </span>
                    <span className="text-xs tabular-nums">
                      {p.percent.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};

/* ─── Sub-components (local) ─────────────────────────────── */

function QuickStat({
  icon,
  value,
  label,
  small,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border bg-muted/30 p-2.5">
      <span className="text-muted-foreground">{icon}</span>
      <span
        className={cn(
          "font-semibold tabular-nums text-foreground leading-none",
          small ? "text-xs" : "text-base"
        )}
      >
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground leading-none">
        {label}
      </span>
    </div>
  );
}

function FatigueBar({
  label,
  value,
  icon,
  desc,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  desc: string;
}) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="space-y-1.5 cursor-help">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <span className="text-muted-foreground">{icon}</span>
              {label}
            </div>
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                fatigueColor(clamped)
              )}
            >
              {fatigueLabel(clamped)}
            </span>
          </div>
          <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute h-full rounded-full transition-all duration-500",
                fatigueBarColor(clamped)
              )}
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-xs">
        <p className="font-medium">{label} Fatigue</p>
        <p className="text-muted-foreground mt-0.5">{desc}</p>
        <p className="mt-1 tabular-nums">
          Score: {(clamped / 10).toFixed(1)} / 10
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

function RatioPill({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const clamped = Math.max(0, Math.min(2, value));
  let status: string;
  let dotColor: string;

  if (clamped < 0.7 || clamped > 1.4) {
    status = "Imbalanced";
    dotColor = "bg-load-max";
  } else if (clamped < 0.85 || clamped > 1.2) {
    status = "Slight bias";
    dotColor = "bg-load-medium";
  } else {
    status = "Balanced";
    dotColor = "bg-load-low";
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col gap-1 rounded-lg border p-3 cursor-help hover:bg-muted/30 transition-colors">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
            {label}
          </span>
          <span className="text-lg font-semibold tabular-nums text-foreground leading-none">
            {clamped.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
            <span className="text-[10px] text-muted-foreground">{status}</span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-xs max-w-[200px]">
        A value of 1.0 means equal volume. Currently{" "}
        <strong>{clamped.toFixed(2)}</strong>.
      </TooltipContent>
    </Tooltip>
  );
}
