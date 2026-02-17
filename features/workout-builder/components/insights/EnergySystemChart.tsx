"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { EnergySystem } from "@/engines/main";
import { Flame, Heart, Zap } from "lucide-react";

type Props = {
  /** Can be fractions (0..1), percents (0..100), or counts */
  systemBreakdown: Record<EnergySystem, number>;
};

const ICON: Record<string, React.ReactNode> = {
  ATP_CP: <Heart className="w-4 h-4 text-load-low" />,
  Glycolytic: <Zap className="w-4 h-4 text-load-medium" />,
  Oxidative: <Flame className="w-4 h-4 text-load-high" />,
};

const BAR: Record<string, string> = {
  ATP_CP: "bg-load-low",
  Glycolytic: "bg-load-medium",
  Oxidative: "bg-load-high",
};

export function EnergySystemChart({ systemBreakdown }: Props) {
  const entries = Object.entries(systemBreakdown ?? {});
  const total = entries.reduce((s, [, v]) => s + (v ?? 0), 0) || 1;

  // Convert to percents that sum to 100
  const parts = entries.map(([k, v]) => ({
    key: k,
    percent: Math.max(0, Math.min(100, (v / total) * 100)),
    raw: v,
  }));

  // For legend: show percent; show raw only if it looks like an integer count
  const showRaw = parts.every(
    (p) => p.raw >= 1 && Math.abs(Math.round(p.raw) - p.raw) < 1e-6
  );

  return (
    <Card className="space-y-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          <span className="text-lg font-semibold">Energy System Focus</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stacked bar that always fills 100% */}
        <div className="relative h-3 rounded-full overflow-hidden flex bg-muted">
          {parts.map((p) => (
            <div
              key={p.key}
              className={`${BAR[p.key] ?? "bg-muted-foreground"} h-full`}
              style={{ width: `${p.percent}%` }}
              title={`${p.key}: ${p.percent.toFixed(0)}%`}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm pt-1">
          {parts.map((p) => (
            <div
              key={p.key}
              className="flex items-center gap-2 text-muted-foreground"
            >
              {ICON[p.key] ?? <Flame className="w-4 h-4" />}
              <span className="font-medium">
                {p.key === "ATP_CP" ? "ATP-CP" : p.key}
              </span>
              <span className="text-xs">
                {showRaw ? `${Math.round(p.raw)}x, ` : ""}
                {p.percent.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
