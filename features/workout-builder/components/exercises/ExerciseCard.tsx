import { TermTooltip } from "@/components/TermTooltip";
import { Button } from "@/components/ui/button";
import { ExerciseDetailModal } from "@/features/workout-builder/components/exercises/ExerciseDetailModal";
import { Exercise } from "@/types/Exercise";
import { Activity, AlertTriangle, Brain, Clock, Plus, Zap } from "lucide-react";

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: () => void;
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <TermTooltip term={children?.toString().toLowerCase() ?? ""}>
    <span className="px-1 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  </TermTooltip>
);

const Metric = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}) => (
  <div className="flex items-center gap-1">
    {icon}
    <TermTooltip term={label.toLowerCase().replace(" ", "_")}>
      <span className={color || "text-muted-foreground"}>
        {label}: {value.toFixed(1)}
      </span>
    </TermTooltip>
  </div>
);

export const ExerciseCard = ({ exercise, onAdd }: ExerciseCardProps) => {
  const fatigueScore = exercise.fatigue.index * 10;

  const getFatigueColor = (value: number) => {
    if (value <= 3) return "text-green-600";
    if (value <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="group relative p-4 bg-background border border-border rounded-xl shadow-sm hover:shadow-md hover:border-border transition mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground text-lg">
              {exercise.name}
            </h3>
            {exercise.aliases?.[0] && (
              <span className="text-xs text-muted-foreground">
                ({exercise.aliases[0]})
              </span>
            )}
          </div>

          {/* Recovery & Fatigue */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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

          {/* Meta Info */}
          <div className="text-xs text-muted-foreground mb-2">
            <TermTooltip term={exercise.load_profile.toLowerCase()}>
              <span className="text-xs text-muted-foreground">
                {exercise.load_profile.toUpperCase()} •{" "}
              </span>
            </TermTooltip>
            <TermTooltip term={exercise.movement_plane.toLowerCase()}>
              <span className="text-xs text-muted-foreground">
                {exercise.movement_plane.toUpperCase()} •{" "}
              </span>
            </TermTooltip>
            <TermTooltip term={exercise.force_curve.toLowerCase()}>
              <span className="text-xs text-muted-foreground">
                {exercise.force_curve.toUpperCase()}
              </span>
            </TermTooltip>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {exercise.compound && <Tag>Compound</Tag>}
            {exercise.unilateral && <Tag>Unilateral</Tag>}
            {exercise.ballistic && (
              <TermTooltip term="ballistic">
                <span className="px-1 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-medium">
                  Ballistic
                </span>
              </TermTooltip>
            )}
            <TermTooltip term="romRating">
              <span className="px-1 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                ROM: {exercise.rom_rating}
              </span>
            </TermTooltip>
            <TermTooltip term="skillRequirement">
              <span className="px-1 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                Skill: {exercise.skill_requirement}
              </span>
            </TermTooltip>
          </div>

          {/* Fatigue Breakdown */}
          <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
            <Metric
              icon={<Brain className="w-3 h-3" />}
              label="CNS"
              value={exercise.fatigue.cns_demand * 10}
            />
            <Metric
              icon={<Activity className="w-3 h-3" />}
              label="Met"
              value={exercise.fatigue.metabolic_demand * 10}
            />
            <Metric
              icon={<AlertTriangle className="w-3 h-3" />}
              label="Joint"
              value={exercise.fatigue.joint_stress * 10}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 ml-4">
          <ExerciseDetailModal exercise={exercise} />
          <Button onClick={onAdd} variant="outline" size="icon">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
