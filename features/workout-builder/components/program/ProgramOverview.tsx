// ProgramOverviewPanel.tsx — guided, polished overview

"use client";

import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Timer,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useExercises } from "@/hooks/useExercises";
import { useProgramEngine } from "@/hooks/useProgramEngine";

import type { WeekMetrics } from "@/engines/main";
import type { Program } from "@/types/Workout";

import ScoreDial from "@/components/ScoreDial";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import {
  buildSequence,
  buildSpecFromProgram,
} from "@/engines/core/utils/helpers";
import { clamp, pct } from "@/utils/math";

const RECOMMENDED_MINUTES: [number, number] = [180, 300];

// map roles -> crude daily loads (tweak numbers if you like)
const ROLE_LOAD = { High: 90, Medium: 60, Low: 30 } as const;

export function fosterMonotonyAndStrain(roles: ("High" | "Medium" | "Low")[]) {
  const loads = roles.map((r) => ROLE_LOAD[r] ?? 60);
  const n = Math.max(roles.length, 1);
  const sum = loads.reduce((a, c) => a + c, 0);
  const mean = sum / n;

  // population SD (fine for our purpose); guard SD=0
  const sd = Math.sqrt(loads.reduce((a, c) => a + (c - mean) ** 2, 0) / n) || 1;

  const monotony = mean / sd; // higher = less variety
  const weeklyLoad = sum; // proxy for total load
  const strain = weeklyLoad * monotony; // Foster

  // Optional: cap to avoid wild UI outliers
  return {
    weeklyLoad,
    monotony: Math.min(monotony, 6),
    strain: Math.round(strain),
  };
}

function biasVerdict(r: number, left: string, right: string) {
  if (!Number.isFinite(r) || r <= 0) return "—";
  if (r > 1.2) return `${right}-biased`;
  if (r < 0.83) return `${left}-biased`;
  return "Balanced";
}

function MinutesBand({
  band,
  value,
}: {
  band: [number, number];
  value: number;
}) {
  const [min, max] = band;
  const fill = clamp(value / Math.max(1, max), 0, 1);
  const left = (min / Math.max(1, max)) * 100;
  const width = ((max - min) / Math.max(1, max)) * 100;

  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${left}%`,
            width: `${width}%`,
            background: "oklch(0.90 0.12 150 / 0.5)",
          }}
        />
        <div
          className="h-full rounded-full bg-primary/70"
          style={{ width: pct(fill) }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Recommended {min}–{max} min / wk • You’re at{" "}
        <span className="tabular-nums">{Math.round(value)}</span> min
      </div>
    </div>
  );
}

function StressRibbon({ week }: { week: WeekMetrics }) {
  return (
    <div className="flex gap-2">
      {week.roles.map((r, i) => {
        const bg =
          r === "High"
            ? "bg-rose-500"
            : r === "Medium"
            ? "bg-amber-500"
            : "bg-emerald-500";
        return <div key={i} className={`h-3 w-12 rounded ${bg}`} title={r} />;
      })}
    </div>
  );
}

function IntensityBar({
  high = 0,
  moderate = 0,
  low = 0,
}: {
  high?: number;
  moderate?: number;
  low?: number;
}) {
  const sum = Math.max(1, high + moderate + low);
  return (
    <div className="relative h-2 rounded-full overflow-hidden bg-muted">
      <div
        className="absolute inset-y-0 left-0 bg-rose-500"
        style={{ width: pct(high / sum) }}
      />
      <div
        className="absolute inset-y-0 bg-amber-500"
        style={{ left: pct(high / sum), width: pct(moderate / sum) }}
      />
      <div
        className="absolute inset-y-0 right-0 bg-emerald-500"
        style={{ width: pct(low / sum) }}
      />
    </div>
  );
}

function RatioTile({
  label,
  ratio,
  left,
  right,
}: {
  label: string;
  ratio?: number;
  left: string;
  right: string;
}) {
  const r = Number.isFinite(ratio!) && ratio! > 0 ? ratio! : 1;
  const verdict = biasVerdict(r, left, right);
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold tabular-nums">
          {r.toFixed(2)}
        </span>
        <Badge variant="secondary" className="rounded-full">
          {verdict}
        </Badge>
      </div>
      <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/60"
          style={{
            width: `${Math.min(100, Math.abs(Math.log2(r)) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export function ProgramOverviewPanel({ program }: { program: Program }) {
  const { data: allExercises = [] } = useExercises();

  const spec = useMemo(() => buildSpecFromProgram(program), [program]);
  const sequence = useMemo(
    () => buildSequence(program, allExercises),
    [program, allExercises]
  );

  const {
    week,
    program: programMetrics,
    nudges,
  } = useProgramEngine(spec, sequence);

  // Simple, robust derivations so it works for all users
  const sessionsPerWeek = week.roles.length || 0;
  const avgSessionMin =
    sessionsPerWeek > 0 ? week.projectedWeeklyMinutes / sessionsPerWeek : 0;

  const { monotony, strain } = fosterMonotonyAndStrain(week.roles);

  const ih = week.intensityHistogram ?? { high: 0, moderate: 0, low: 0 };

  const topFocus = useMemo(() => {
    const entries = Object.entries(week.volumeByMuscle || {});
    const sorted = entries
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .slice(0, 6);
    return sorted.map(([id, sets]) => ({
      id,
      label:
        MUSCLE_DISPLAY_MAP[id as keyof typeof MUSCLE_DISPLAY_MAP] ??
        id.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      sets,
    }));
  }, [week.volumeByMuscle]);

  const lowAttention = useMemo(() => {
    const entries = Object.entries(week.volumeByMuscle || {});
    return entries
      .filter(([, v]) => v < 3)
      .sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0))
      .slice(0, 10)
      .map(([id, sets]) => ({
        id,
        label:
          MUSCLE_DISPLAY_MAP[id as keyof typeof MUSCLE_DISPLAY_MAP] ??
          id.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        sets,
      }));
  }, [week.volumeByMuscle]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border bg-card/80 backdrop-blur">
        <CardContent className="p-5 grid gap-6 md:grid-cols-[auto_1fr]">
          <ScoreDial
            value={programMetrics?.goalFitScore ?? week.projectedWeeklyScore}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Sessions / wk</div>
              <div className="text-lg font-semibold tabular-nums">
                {sessionsPerWeek.toFixed(1)}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Avg session</div>
              <div className="text-lg font-semibold tabular-nums">
                {Math.round(avgSessionMin)} min
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Monotony</div>
              <div className="text-lg font-semibold tabular-nums">
                {monotony.toFixed(2)}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Strain {Math.round(strain)}
              </div>
            </div>

            <div className="sm:col-span-3">
              <MinutesBand
                band={RECOMMENDED_MINUTES}
                value={week.projectedWeeklyMinutes}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-card/80">
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span>Stress pattern</span>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-2 space-y-3">
          <StressRibbon week={week} />
          {week.spacingFlags.length > 0 ? (
            <div className="text-sm text-rose-600">
              {week.spacingFlags.join(" • ")}
            </div>
          ) : (
            <div className="text-sm text-emerald-600">
              Good spacing—no red flags.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-card/80">
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Intensity & Balance</span>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-2 grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Intensity mix
            </div>
            <IntensityBar high={ih.high} moderate={ih.moderate} low={ih.low} />
            <div className="mt-2 text-sm text-muted-foreground space-x-3">
              <span>
                High{" "}
                {pct(ih.high / Math.max(1, ih.high + ih.moderate + ih.low))}
              </span>
              <span>
                • Medium{" "}
                {pct(ih.moderate / Math.max(1, ih.high + ih.moderate + ih.low))}
              </span>
              <span>
                • Low{" "}
                {pct(ih.low / Math.max(1, ih.high + ih.moderate + ih.low))}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <RatioTile
              label="Push : Pull"
              ratio={week.balanceRatios.pushPull}
              left="Pull"
              right="Push"
            />
            <RatioTile
              label="Quad : Ham"
              ratio={week.balanceRatios.quadHam}
              left="Ham"
              right="Quad"
            />
            <RatioTile
              label="Upper : Lower"
              ratio={week.balanceRatios.upperLower}
              left="Lower"
              right="Upper"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-card/80">
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Muscle coverage (per-week avg)</span>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-2 space-y-4">
          <div className="text-xs text-muted-foreground">Top focus</div>
          <div className="flex flex-wrap gap-2">
            {topFocus.map((m) => (
              <Badge
                key={m.id}
                variant="secondary"
                className="rounded-full bg-primary/5 border-primary/15"
                title={`${m.label} • ${m.sets.toFixed(1)} sets/wk`}
              >
                {m.label} • {m.sets.toFixed(1)} sets/wk
              </Badge>
            ))}
          </div>

          {lowAttention.length > 0 && (
            <>
              <div className="text-xs text-muted-foreground">Low attention</div>
              <div className="flex flex-wrap gap-2">
                {lowAttention.map((m) => (
                  <Badge
                    key={m.id}
                    variant="outline"
                    className="rounded-full"
                    title={`${m.label} < 3 sets/wk`}
                  >
                    {m.label} • &lt; 3 sets/wk
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-card/80">
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>Coach</span>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          {nudges.length === 0 ? (
            <div className="text-sm text-emerald-600">
              Looks good—no changes suggested.
            </div>
          ) : (
            <ul className="space-y-2">
              {nudges.slice(0, 6).map((n, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[10px] border">
                    {i + 1}
                  </span>
                  <div className="text-sm">{n}</div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Button variant="outline" size="sm" className="gap-1">
              Improve this week <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span>
            Edits re-score instantly. Minutes band is a general-purpose
            recommendation.
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProgramOverviewPanel;
