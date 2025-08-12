"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BarChart3, Info } from "lucide-react";

interface RatioIndicatorProps {
  value: number;
  labelLeft: string;
  labelRight: string;
  ideal?: number;
  normalized?: boolean;
  icon?: React.ReactNode;
  explanation?: string;
}

export function RatioIndicator({
  value,
  labelLeft,
  labelRight,
  ideal = 1.0,
  normalized = false,
  icon,
  explanation,
}: RatioIndicatorProps) {
  const rawValue = Math.max(0, Math.min(2, value));
  const displayValue = normalized ? rawValue / (1 + rawValue) : rawValue;
  const percent = Math.max(0, Math.min(1, displayValue)) * 100;
  const idealPercent = normalized
    ? ideal / (1 + ideal)
    : (Math.max(0, Math.min(2, ideal)) / 2) * 100;

  // Status & color coding
  let status = "Well Balanced";
  let markerColor = "bg-emerald-500 shadow-emerald-500/50 border-emerald-600";
  let statusBadge = "bg-emerald-100 text-emerald-700 border border-emerald-200";

  if (rawValue < 0.6) {
    status = `${labelLeft} Dominant`;
    markerColor = "bg-violet-500 shadow-violet-500/50 border-violet-600";
    statusBadge = "bg-violet-100 text-violet-700 border border-violet-200";
  } else if (rawValue > 1.4) {
    status = `${labelRight} Dominant`;
    markerColor = "bg-rose-500 shadow-rose-500/50 border-rose-600";
    statusBadge = "bg-rose-100 text-rose-700 border border-rose-200";
  } else if (rawValue < 0.8 || rawValue > 1.2) {
    status = "Slightly Imbalanced";
    markerColor = "bg-amber-500 shadow-amber-500/50 border-amber-600";
    statusBadge = "bg-amber-100 text-amber-700 border border-amber-200";
  }

  return (
    <div className="space-y-3 p-4 bg-background rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon ?? <BarChart3 className="w-4 h-4" />} {labelLeft} vs{" "}
          {labelRight}
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              A value of 1.0 means equal volume between{" "}
              <strong>{labelLeft}</strong> and <strong>{labelRight}</strong>.
              Values above or below suggest a bias in your training.
              <br />
              {explanation}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-center">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Ratio
        </div>
        <div className="text-2xl font-bold text-foreground">
          {value.toFixed(2)}
        </div>
      </div>

      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-violet-100 via-muted to-rose-100 rounded-full border border-border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50/50 via-emerald-50/50 to-rose-50/50" />
        </div>

        {/* Ideal marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-muted rounded-full opacity-60"
          style={{ left: `calc(${idealPercent}% - 1px)` }}
        />

        {/* Ratio marker */}
        <div
          className={cn(
            "absolute -top-1 w-5 h-5 rounded-full border-2 shadow-lg transition-all duration-300 transform hover:scale-110",
            markerColor
          )}
          style={{ left: `calc(${percent}% - 10px)` }}
        >
          <div className="absolute inset-0.5 bg-white/30 rounded-full" />
        </div>

        {/* Tick marks */}
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-2">
          {[0, 0.5, 1, 1.5, 2].map((tick) => (
            <div key={tick} className="flex flex-col items-center">
              <div className="w-px h-2 bg-muted" />
              <span className="text-xs text-muted-foreground mt-1">
                {tick.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-center">
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            statusBadge
          )}
        >
          {status}
        </div>
      </div>
    </div>
  );
}
