import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WorkoutExercise } from "@/types/Workout";
import { getWorkoutInsights } from "@/utils/getWorkoutInsights";
import { getWorkoutTypeFromCategories } from "@/utils/getWorkoutTypeFromCategories";
import { Dumbbell, Info } from "lucide-react";
import { EmptyState } from "../../../components/EmptyState";
import { MuscleVolumeRow } from "./MuscleVolumeRow";
import { RatioIndicator } from "./RatioIndicator";
import { TopMusclesList } from "./TopMusclesList";

interface WorkoutInsightsPanelProps {
  workout: WorkoutExercise[];
}

const InfoIconWithTooltip = ({ message }: { message: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="w-4 h-4 text-slate-400 cursor-help" />
    </TooltipTrigger>
    <TooltipContent className="max-w-[220px] text-xs">{message}</TooltipContent>
  </Tooltip>
);

export const WorkoutInsightsPanel = ({
  workout,
}: WorkoutInsightsPanelProps) => {
  const {
    total_fatigue,
    avg_recovery,
    muscle_volumes,
    muscle_set_counts,
    category_counts,
    injury_risk,
    push_pull_ratio,
    lower_upper_ratio,
    total_sets,
    top_muscles,
  } = getWorkoutInsights(workout);

  const workoutType = getWorkoutTypeFromCategories(category_counts);

  const maxVolume = top_muscles[0]?.[1] || 1;

  if (workout.length === 0)
    return (
      <EmptyState
        icon={<Dumbbell />}
        title="No exercises added"
        description="Please add exercises to see insights"
      />
    );

  return (
    <Card className="max-h-fit">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">
          Program Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <div className="space-y-1">
          <div>
            <span className="font-medium">Workout Type:</span>{" "}
            <Badge variant="secondary">
              {workoutType.charAt(0).toUpperCase() + workoutType.slice(1)}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Injury Risk:</span>{" "}
            <Badge
              className={
                injury_risk === "High"
                  ? "bg-red-500"
                  : injury_risk === "Moderate"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }
            >
              {injury_risk}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <div>
            <span className="font-medium">Total Sets:</span> {total_sets}
          </div>
          <div>
            <span className="font-medium">Avg Recovery Time:</span>{" "}
            {avg_recovery.toFixed(2)} days
          </div>
          <div>
            <span className="font-medium">Total Fatigue Score:</span>{" "}
            {total_fatigue.toFixed(1)}
          </div>
        </div>

        <div className="space-y-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Push/Pull Ratio</span>
              <InfoIconWithTooltip message="Shows the balance between pushing and pulling work. Closer to 1.0 is ideal." />
            </div>
            <RatioIndicator
              value={push_pull_ratio || 1}
              labelLeft="Pull"
              labelRight="Push"
              normalized
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Upper/Lower Ratio</span>
              <InfoIconWithTooltip message="Shows the balance between upper and lower body work. Closer to 1.0 is ideal." />
            </div>
            <RatioIndicator
              value={lower_upper_ratio || 1}
              labelLeft="Lower"
              labelRight="Upper"
              normalized
            />
          </div>
        </div>

        <div className="space-y-1">
          <TopMusclesList topMuscles={top_muscles} />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700">
            Muscle Group Volume
          </h4>
          {Object.entries(muscle_volumes).map(([muscle, volume], index) => (
            <MuscleVolumeRow
              key={muscle}
              index={index}
              muscleId={muscle}
              setCount={muscle_set_counts[muscle]}
              weightedVolume={volume}
              maxVolume={maxVolume}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
