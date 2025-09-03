import * as React from "react";

type ScoreDialProps = {
  value: number;
  size?: number;
  thickness?: number;
  trackColor?: string;
  fillColor?: string | ((value: number) => string);
  children?: React.ReactNode;
  className?: string;
  holeColor?: string;
  ariaLabel?: string;
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n)) / 100;
}

export default function ScoreDial({
  value,
  size = 64,
  thickness = 6,
  trackColor = "oklch(0.92 0.02 150 / 1)",
  fillColor,
  children,
  className = "",
  holeColor = "var(--color-card, var(--card, white))",
  ariaLabel = "Score",
}: ScoreDialProps) {
  const t = clamp01(value);
  const deg = t * 360;

  const resolvedFill =
    typeof fillColor === "function"
      ? fillColor(value)
      : fillColor ?? `oklch(0.72 0.18 ${20 + Math.round(value)})`;

  const outerStyle: React.CSSProperties = {
    width: size,
    height: size,
    background: `conic-gradient(${resolvedFill} ${deg}deg, ${trackColor} 0)`,
  };

  const innerStyle: React.CSSProperties = {
    position: "absolute",
    inset: thickness,
    borderRadius: "9999px",
    background: holeColor,
  };

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(t * 100)}
      className={`relative grid place-items-center rounded-full ${className}`}
      style={outerStyle}
    >
      <div
        className="grid place-items-center border border-[color:var(--color-border,rgba(0,0,0,0.08))]"
        style={innerStyle}
      >
        {children ?? (
          <span
            style={{ fontFeatureSettings: "'tnum' 1" }}
            className="text-value"
          >
            {Math.round(t * 100)}
          </span>
        )}
      </div>
    </div>
  );
}
