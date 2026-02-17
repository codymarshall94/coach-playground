import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreDialProps {
  value: number;
  size?: number;
  thickness?: number;
  trackColor?: string;
  fillColor?: string | ((value: number) => string);
  children?: React.ReactNode;
  className?: string;
  /** @deprecated No longer needed — center uses parent background */
  holeColor?: string;
  ariaLabel?: string;
}

function clampValue(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

/** Map a 0-100 score to a semantic color (higher = better). */
function defaultScoreColor(v: number): string {
  if (v >= 80) return "var(--color-load-low)";
  if (v >= 60) return "var(--color-load-medium)";
  if (v >= 40) return "var(--color-load-high)";
  return "var(--color-load-max)";
}

export default function ScoreDial({
  value,
  size = 64,
  thickness = 6,
  trackColor,
  fillColor,
  children,
  className,
  ariaLabel = "Score",
}: ScoreDialProps) {
  const v = clampValue(value);
  const t = v / 100;

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - t);
  const center = size / 2;

  const resolvedFill =
    typeof fillColor === "function"
      ? fillColor(value)
      : fillColor ?? defaultScoreColor(v);

  return (
    <div
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {/* Track ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor ?? "var(--color-muted)"}
          strokeWidth={thickness}
        />
        {/* Filled arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={resolvedFill}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>

      {/* Center content */}
      <div className="z-10 flex items-center justify-center">
        {children ?? (
          <span className="text-sm font-semibold tabular-nums leading-none">
            {Math.round(v)}
          </span>
        )}
      </div>
    </div>
  );
}
