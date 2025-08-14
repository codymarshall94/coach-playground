"use client";

import { TermTooltip } from "@/components/TermTooltip";
import { Button } from "@/components/ui/button";
import { ExerciseDetailModal } from "@/features/workout-builder/components/exercises/ExerciseDetailModal";
import type { Exercise } from "@/types/Exercise";
import { Clock, Zap } from "lucide-react";
import { useMemo } from "react";

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
}

function SoftChip({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] font-medium " +
        "bg-[color:color-mix(in_oklch,currentColor_14%,transparent)] " +
        "shadow-[inset_0_0_0_1px] shadow-[color:color-mix(in_oklch,currentColor_22%,transparent)] " +
        className
      }
      style={style}
    >
      {children}
    </span>
  );
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <TermTooltip term={children?.toString().toLowerCase() ?? ""}>
    <span className="px-1.5 py-[2px] rounded border border-border bg-muted text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  </TermTooltip>
);

export const ExerciseCard = ({ exercise, onAdd }: ExerciseCardProps) => {
  const fatigue10 = exercise.fatigue_index * 10;
  const fatigueVar = useMemo<
    `-load-low` | `-load-medium` | `-load-high` | `-load-max`
  >(() => {
    if (fatigue10 <= 3) return "-load-low";
    if (fatigue10 <= 6) return "-load-medium";
    if (fatigue10 <= 9) return "-load-high";
    return "-load-max";
  }, [fatigue10]);

  return (
    <div
      className="
        group relative mb-3 rounded-2xl border border-border bg-card
        p-4 shadow-sm transition hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-3">
        {/* LEFT */}
        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold leading-snug text-foreground">
              {exercise.name}
            </h3>
            {exercise.aliases?.[0] && (
              <span className="shrink-0 text-xs italic text-muted-foreground">
                ({exercise.aliases[0]})
              </span>
            )}
          </div>

          {/* Primary metrics row */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <SoftChip className="text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <TermTooltip term="recovery_days">
                <span>Recovery: {exercise.recovery_days.toFixed(1)}</span>
              </TermTooltip>
            </SoftChip>

            <SoftChip
              className="text-[color:var(--load-low)]"
              style={{ color: `var(${fatigueVar})` }}
            >
              <Zap className="h-3.5 w-3.5" />
              <TermTooltip term="fatigue">
                <span>Fatigue: {fatigue10.toFixed(1)}</span>
              </TermTooltip>
            </SoftChip>
          </div>

          {/* Tags */}
          <div className="mb-1 flex flex-wrap gap-1.5">
            {exercise.compound && <Tag>Compound</Tag>}
            <Tag>ROM: {exercise.rom_rating}</Tag>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ml-2 flex shrink-0 flex-col items-end gap-2">
          <ExerciseDetailModal exercise={exercise} />
          <Button
            onClick={() => onAdd(exercise)}
            size="sm"
            className="
              rounded-full px-3 text-xs
              bg-primary text-primary-foreground hover:bg-primary/90
              hover:opacity-90
            "
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
