"use client";

import { TermTooltip } from "@/components/TermTooltip";
import { Button } from "@/components/ui/button";
import { ExerciseDetailModal } from "@/features/workout-builder/components/exercises/ExerciseDetailModal";
import { Exercise } from "@/types/Exercise";
import { Clock, Zap, Brain, Activity, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: () => void;
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <TermTooltip term={children?.toString().toLowerCase() ?? ""}>
    <span className="px-1 py-0.5 bg-muted border border-muted/50 rounded text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  </TermTooltip>
);

const Metric = ({
  icon,
  label,
  value,
  color,
  size = "text-sm",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
  size?: string;
}) => (
  <div className={`flex items-center gap-1 ${size}`}>
    {icon}
    <TermTooltip term={label.toLowerCase().replace(" ", "_")}>
      <span className={color || "text-muted-foreground"}>
        {label}: {value.toFixed(1)}
      </span>
    </TermTooltip>
  </div>
);

export const ExerciseCard = ({ exercise, onAdd }: ExerciseCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const fatigueScore = exercise.fatigue.index * 10;

  const getFatigueColor = (value: number) => {
    if (value <= 3) return "text-load-low";
    if (value <= 6) return "text-load-medium";
    if (value <= 9) return "text-load-max";
    return "text-destructive";
  };

  return (
    <div className="group relative p-4 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition mb-3">
      <div className="flex items-start justify-between">
        {/* === LEFT PANEL === */}
        <div className="flex-1">
          {/* === TITLE === */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground leading-snug">
              {exercise.name}
            </h3>
            {exercise.aliases?.[0] && (
              <span className="text-xs italic text-muted-foreground">
                ({exercise.aliases[0]})
              </span>
            )}
          </div>

          {/* === KEY METRICS === */}
          <div className="flex items-center gap-4 mb-2">
            <Metric
              icon={<Clock className="w-4 h-4" />}
              label="Recovery"
              value={exercise.recovery_days}
            />
            <Metric
              icon={
                <Zap className={`w-4 h-4 ${getFatigueColor(fatigueScore)}`} />
              }
              label="Fatigue"
              value={fatigueScore}
              color={getFatigueColor(fatigueScore)}
            />
          </div>

          {/* === HIGHLIGHTED TAGS === */}
          <div className="flex flex-wrap gap-1 mb-1">
            {exercise.compound && <Tag>Compound</Tag>}
            <Tag>ROM: {exercise.rom_rating}</Tag>
          </div>

          {/* === EXPANDABLE METRICS === */}
          {expanded && (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                <TermTooltip term={exercise.load_profile.toLowerCase()}>
                  <span>{exercise.load_profile.toUpperCase()} • </span>
                </TermTooltip>
                <TermTooltip term={exercise.movement_plane.toLowerCase()}>
                  <span>{exercise.movement_plane.toUpperCase()} • </span>
                </TermTooltip>
                <TermTooltip term={exercise.force_curve.toLowerCase()}>
                  <span>{exercise.force_curve.toUpperCase()}</span>
                </TermTooltip>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {exercise.unilateral && <Tag>Unilateral</Tag>}
                {exercise.ballistic && (
                  <TermTooltip term="ballistic">
                    <span className="px-1 py-0.5 bg-orange-100 text-orange-800 border border-orange-200 rounded text-[10px] font-medium">
                      Ballistic
                    </span>
                  </TermTooltip>
                )}
                <Tag>Skill: {exercise.skill_requirement}</Tag>
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground mb-1">
                <Metric
                  icon={<Brain className="w-3 h-3" />}
                  label="CNS"
                  value={exercise.fatigue.cns_demand * 10}
                  size="text-xs"
                />
                <Metric
                  icon={<Activity className="w-3 h-3" />}
                  label="Met"
                  value={exercise.fatigue.metabolic_demand * 10}
                  size="text-xs"
                />
                <Metric
                  icon={<AlertTriangle className="w-3 h-3" />}
                  label="Joint"
                  value={exercise.fatigue.joint_stress * 10}
                  size="text-xs"
                />
              </div>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-xs mt-2 text-muted-foreground hover:text-primary"
            onClick={() => setExpanded((p) => !p)}
          >
            {expanded ? "Hide details" : "Show more metrics"}
            <span
              className={`transition-transform ml-1 ${
                expanded ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </Button>
        </div>

        {/* === RIGHT PANEL === */}
        <div className="flex flex-col items-end gap-2 ml-4">
          <ExerciseDetailModal exercise={exercise} />
          <Button
            onClick={onAdd}
            variant="outline"
            size="sm"
            className="rounded-full text-xs px-3"
          >
            Add +
          </Button>
        </div>
      </div>
    </div>
  );
};
