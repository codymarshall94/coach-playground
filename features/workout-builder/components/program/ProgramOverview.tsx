// ProgramOverviewPanel.tsx — weekly program summary

"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import Model, { type Muscle } from "react-body-highlighter";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useExercises } from "@/hooks/useExercises";
import { useProgramEngine } from "@/hooks/useProgramEngine";

import type { ImprovementItem } from "@/engines/coach/improvementPlan";
import type { SubScores, WeekMetrics } from "@/engines/main";
import type { Program } from "@/types/Workout";

import ScoreDial from "@/components/ScoreDial";
import { MUSCLE_DISPLAY_MAP, MUSCLE_NAME_MAP } from "@/constants/muscles";
import {
  buildSequence,
  buildSpecFromProgram,
} from "@/engines/core/utils/helpers";
import { cn } from "@/lib/utils";

/* ─── Exported utility (used by tests) ─── */

const ROLE_LOAD = { High: 90, Medium: 60, Low: 30 } as const;

export function fosterMonotonyAndStrain(roles: ("High" | "Medium" | "Low")[]) {
  const loads = roles.map((r) => ROLE_LOAD[r] ?? 60);
  const n = Math.max(roles.length, 1);
  const sum = loads.reduce((a, c) => a + c, 0);
  const mean = sum / n;
  const sd =
    Math.sqrt(loads.reduce((a, c) => a + (c - mean) ** 2, 0) / n) || 1;
  const monotony = mean / sd;
  const strain = sum * monotony;
  return {
    weeklyLoad: sum,
    monotony: Math.min(monotony, 6),
    strain: Math.round(strain),
  };
}

/* ─── Shared legend for the square grids ─── */
function GridLegend() {
  return (
    <div className="flex gap-3 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-load-low" />
        Light
      </span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-load-medium" />
        Moderate
      </span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-load-max" />
        Heavy
      </span>
    </div>
  );
}

/* ─── Square grids ─── */

function StressGrid({
  week,
  dayNames,
}: {
  week: WeekMetrics;
  dayNames: string[];
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex gap-1.5 flex-wrap">
        {week.roles.map((r, i) => {
          const bg =
            r === "High"
              ? "bg-load-max"
              : r === "Medium"
                ? "bg-load-medium"
                : "bg-load-low";
          const label = dayNames[i] ?? `Day ${i + 1}`;
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "h-6 w-6 rounded-[3px] cursor-default transition-transform hover:scale-110",
                    bg,
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <span className="font-medium">{label}</span> — {r} stress
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function IntensityGrid({
  high = 0,
  moderate = 0,
  low = 0,
}: {
  high?: number;
  moderate?: number;
  low?: number;
}) {
  const total = high + moderate + low;
  if (total === 0) return null;

  const blocks = 10;
  const hBlocks = Math.round((high / total) * blocks);
  const mBlocks = Math.round((moderate / total) * blocks);
  const lBlocks = Math.max(0, blocks - hBlocks - mBlocks);

  const grid: { label: string; bg: string }[] = [
    ...Array(hBlocks).fill({ label: "Heavy", bg: "bg-load-max" }),
    ...Array(mBlocks).fill({ label: "Moderate", bg: "bg-load-medium" }),
    ...Array(lBlocks).fill({ label: "Light", bg: "bg-load-low" }),
  ];

  const hPct = Math.round((high / total) * 100);
  const mPct = Math.round((moderate / total) * 100);
  const lPct = 100 - hPct - mPct;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-2">
        <div className="flex gap-1.5 flex-wrap">
          {grid.map((g, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "h-6 w-6 rounded-[3px] cursor-default transition-transform hover:scale-110",
                    g.bg,
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {g.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>Heavy {hPct}%</span>
          <span>Moderate {mPct}%</span>
          <span>Light {lPct}%</span>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ─── Stats ─── */

function StatValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

/* ─── Balance meter (visual tilt bar) ─── */

function BalanceMeter({
  label,
  ratio,
  leftLabel,
  rightLabel,
}: {
  label: string;
  ratio?: number;
  leftLabel: string;
  rightLabel: string;
}) {
  const r = Number.isFinite(ratio!) && ratio! > 0 ? ratio! : 1;

  // Convert ratio to a 0–100 position (50 = balanced)
  // log2(1.0) = 0 → 50, log2(2.0) = 1 → ~85, log2(0.5) = -1 → ~15
  const logR = Math.log2(r);
  const position = Math.max(10, Math.min(90, 50 + logR * 35));

  // Status
  const isBalanced = r >= 0.83 && r <= 1.2;
  const statusText = isBalanced
    ? "Balanced"
    : r > 1.2
      ? `${rightLabel}-heavy`
      : `${leftLabel}-heavy`;
  const statusColor = isBalanced ? "text-positive" : "text-warning";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-[11px] font-medium", statusColor)}>
          {statusText}
        </span>
      </div>

      {/* Tilt bar */}
      <div className="relative">
        {/* Side labels */}
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>

        {/* Track */}
        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-border z-10" />

          {/* Fill — extends from center toward the heavier side */}
          {!isBalanced && (
            <div
              className={cn(
                "absolute top-0 h-full rounded-full transition-all",
                r > 1 ? "bg-warning/60" : "bg-warning/60",
              )}
              style={
                r > 1
                  ? { left: "50%", width: `${Math.min(position - 50, 40)}%` }
                  : { right: "50%", width: `${Math.min(50 - position, 40)}%` }
              }
            />
          )}

          {/* Balanced glow */}
          {isBalanced && (
            <div
              className="absolute top-0 h-full bg-positive/40 rounded-full"
              style={{ left: "40%", width: "20%" }}
            />
          )}

          {/* Indicator dot */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-background shadow-sm transition-all",
              isBalanced ? "bg-positive" : "bg-warning",
            )}
            style={{ left: `${position}%`, marginLeft: "-7px" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Muscle map ─── */

function WeeklyMuscleMap({
  volumeByMuscle,
}: {
  volumeByMuscle: Record<string, number>;
}) {
  const [view, setView] = useState<"anterior" | "posterior">("anterior");

  const { highlightData, sortedEntries } = useMemo(() => {
    const entries = Object.entries(volumeByMuscle).filter(([, v]) => v > 0);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const max = sorted.length > 0 ? sorted[0][1] : 1;

    const data = entries
      .map(([muscleId, sets]) => {
        const mapped =
          MUSCLE_NAME_MAP[muscleId as keyof typeof MUSCLE_NAME_MAP];
        if (!mapped) return null;
        const intensity = Math.max(
          1,
          Math.min(5, Math.round((sets / max) * 5)),
        );
        return {
          name: muscleId,
          muscles: [mapped],
          color: `rgba(59, 130, 246, ${Math.min(0.2 + intensity * 0.15, 0.9)})`,
        };
      })
      .filter(Boolean) as { name: string; muscles: Muscle[]; color: string }[];

    return { highlightData: data, sortedEntries: sorted };
  }, [volumeByMuscle]);

  if (sortedEntries.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Muscle activation</div>
        <div className="flex">
          <button
            type="button"
            onClick={() => setView("anterior")}
            className={cn(
              "px-2.5 py-1 text-[10px] font-medium rounded-l-md border transition-colors",
              view === "anterior"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
            )}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setView("posterior")}
            className={cn(
              "px-2.5 py-1 text-[10px] font-medium rounded-r-md border transition-colors",
              view === "posterior"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
            )}
          >
            Back
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-xl border bg-gradient-to-b from-background to-muted/40 py-3 px-4 max-w-xs mx-auto">
        <Model
          data={highlightData}
          style={{ width: "auto", height: 180, maxWidth: "100%" }}
          bodyColor="#e5e7eb"
          type={view}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sortedEntries.slice(0, 10).map(([muscleId, sets]) => {
          const name =
            MUSCLE_DISPLAY_MAP[muscleId as keyof typeof MUSCLE_DISPLAY_MAP] ??
            muscleId
              .replace(/[_-]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <Badge
              key={muscleId}
              variant="secondary"
              className="rounded-full text-[10px] bg-primary/5 border-primary/15 gap-1"
            >
              {name}
              <span className="tabular-nums font-semibold">
                {sets.toFixed(0)}
              </span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Improvement card (score-impact-aware) ─── */

const DIMENSION_LABELS: Record<keyof SubScores, string> = {
  specificity: "Specificity",
  progression: "Progression",
  stressPatterning: "Recovery",
  volumeFit: "Volume",
  intensityFit: "Intensity",
  balanceHealth: "Balance",
  feasibility: "Time fit",
};

function ImprovementCard({ item }: { item: ImprovementItem }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColor =
    item.priority === "high"
      ? "border-l-destructive"
      : item.priority === "medium"
        ? "border-l-warning"
        : "border-l-muted-foreground/30";

  const priorityBadge =
    item.priority === "high"
      ? "bg-destructive/10 text-destructive"
      : item.priority === "medium"
        ? "bg-warning/10 text-warning"
        : "bg-muted text-muted-foreground";

  const scorePercent = Math.round(item.current * 100);

  return (
    <div
      className={cn(
        "rounded-lg border border-l-[3px] bg-muted/20 transition-colors",
        priorityColor,
      )}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 text-left flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium leading-snug">{item.title}</p>
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full text-[10px] px-1.5 py-0 shrink-0",
                priorityBadge,
              )}
            >
              +{item.pointsGain} pts
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            {item.why}
          </p>
        </div>

        {/* Score gauge + expand toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mini progress ring */}
          <div className="relative h-8 w-8">
            <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-muted/40"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${scorePercent * 0.94} 100`}
                strokeLinecap="round"
                className={cn(
                  scorePercent >= 80
                    ? "text-positive"
                    : scorePercent >= 50
                      ? "text-warning"
                      : "text-destructive",
                )}
                stroke="currentColor"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold tabular-nums">
              {scorePercent}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded steps */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <div className="border-t border-border/50 pt-2" />
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            How to fix
          </p>
          <ol className="space-y-1.5">
            {item.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm leading-snug">
                <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/60" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge
              variant="outline"
              className="rounded-full text-[10px] px-1.5 py-0"
            >
              {DIMENSION_LABELS[item.dimension]}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Currently {scorePercent}% — fix to gain up to{" "}
              <span className="font-semibold text-foreground">
                +{item.pointsGain}
              </span>{" "}
              points
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Main panel ───────────────────── */

export function ProgramOverviewPanel({ program }: { program: Program }) {
  const { data: allExercises = [] } = useExercises();

  const spec = useMemo(() => buildSpecFromProgram(program), [program]);
  const sequence = useMemo(
    () => buildSequence(program, allExercises),
    [program, allExercises],
  );

  const {
    week,
    program: programMetrics,
    improvements,
  } = useProgramEngine(spec, sequence);

  const currentDays = useMemo(() => {
    if (program.mode === "blocks") {
      return (program.blocks ?? []).flatMap((b) => b.days);
    }
    return program.days ?? [];
  }, [program]);

  const dayNames = currentDays.map((d) => d.name || "Day");

  const workoutDayCount = currentDays.filter(
    (d) => d.type === "workout" || d.type === "active_rest",
  ).length;

  const sessionsPerWeek = week.roles.length || 0;
  const avgSessionMin =
    workoutDayCount > 0 ? week.projectedWeeklyMinutes / workoutDayCount : 0;
  const ih = week.intensityHistogram ?? { high: 0, moderate: 0, low: 0 };
  const score = programMetrics?.goalFitScore ?? week.projectedWeeklyScore;

  // Sum potential points to show "you could reach X"
  const potentialGain = improvements.reduce(
    (acc, item) => acc + item.pointsGain,
    0,
  );
  const potentialScore = Math.min(100, score + potentialGain);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 p-4">
      {/* ── Row 1: Score banner ── */}
      <Card className="rounded-2xl border bg-card/80 backdrop-blur">
        <CardContent className="p-5">
          <div className="flex items-start gap-5">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <ScoreDial
                value={score}
                size={72}
                thickness={6}
                ariaLabel="Program score"
              />
              <span className="text-[11px] font-medium text-muted-foreground">
                Score
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="grid grid-cols-3 gap-4">
                <StatValue
                  label="Training days"
                  value={String(workoutDayCount)}
                />
                <StatValue
                  label="Avg session"
                  value={`${Math.round(avgSessionMin)} min`}
                />
                <StatValue
                  label="Weekly total"
                  value={`${Math.round(week.projectedWeeklyMinutes)} min`}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                How well your training structure matches your{" "}
                <span className="font-medium text-foreground">
                  {program.goal}
                </span>{" "}
                goal — based on volume, balance, intensity, and recovery.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Row 2: Stress + Intensity ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border bg-card/80">
          <CardContent className="p-5 space-y-2">
            <div className="text-xs text-muted-foreground">Weekly stress</div>
            {sessionsPerWeek > 0 ? (
              <>
                <StressGrid week={week} dayNames={dayNames} />
                {week.spacingFlags.length > 0 ? (
                  <p className="text-xs text-destructive">
                    {week.spacingFlags.join(" · ")}
                  </p>
                ) : (
                  <p className="text-xs text-positive">
                    Good spacing — no red flags
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Add training days to see stress distribution.
              </p>
            )}
            <p className="text-[11px] text-muted-foreground leading-snug">
              Each square is one training day. Color shows relative effort.
            </p>
            <GridLegend />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/80">
          <CardContent className="p-5 space-y-2">
            <div className="text-xs text-muted-foreground">Intensity mix</div>
            <IntensityGrid
              high={ih.high}
              moderate={ih.moderate}
              low={ih.low}
            />
            <p className="text-[11px] text-muted-foreground leading-snug">
              How your effort is distributed. Strength needs more heavy blocks,
              hypertrophy favors moderate.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Muscle Map + Balance ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border bg-card/80">
          <CardContent className="p-5">
            <WeeklyMuscleMap volumeByMuscle={week.volumeByMuscle} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/80">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Balance</span>
            </div>
            <BalanceMeter
              label="Push : Pull"
              ratio={week.balanceRatios.pushPull}
              leftLabel="Pull"
              rightLabel="Push"
            />
            <BalanceMeter
              label="Quad : Ham"
              ratio={week.balanceRatios.quadHam}
              leftLabel="Ham"
              rightLabel="Quad"
            />
            <BalanceMeter
              label="Upper : Lower"
              ratio={week.balanceRatios.upperLower}
              leftLabel="Lower"
              rightLabel="Upper"
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: How to improve ── */}
      {improvements.length > 0 && (
        <Card className="rounded-2xl border bg-card/80">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>How to improve</span>
              </div>
              {potentialGain > 0 && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">
                    Potential score:{" "}
                    <span className="font-semibold text-foreground">
                      {potentialScore}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground leading-snug">
              Ranked by impact — fix the top items first to improve your score
              the fastest.
            </p>

            <div className="space-y-2">
              {improvements.map((item, i) => (
                <ImprovementCard key={i} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProgramOverviewPanel;
