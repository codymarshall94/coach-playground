"use client";

import { RichTextRenderer } from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  IntensitySystem,
  Program,
  ProgramDay,
  SetInfo,
  WorkoutExercise,
} from "@/types/Workout";
import {
  Activity,
  Calendar,
  Clock,
  Coffee,
  Dumbbell,
  Eye,
  Target,
  Zap,
} from "lucide-react";

interface ProgramPreviewProps {
  program: Program;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const goalIcons = {
  strength: Zap,
  hypertrophy: Dumbbell,
  endurance: Activity,
  power: Target,
};

const goalColors = {
  strength: "bg-red-100 text-red-800 border-red-200",
  hypertrophy: "bg-blue-100 text-blue-800 border-blue-200",
  endurance: "bg-green-100 text-green-800 border-green-200",
  power: "bg-purple-100 text-purple-800 border-purple-200",
};

const dayTypeIcons = {
  workout: Dumbbell,
  rest: Coffee,
  active_rest: Activity,
  other: Calendar,
};

function formatRestTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
}

function formatIntensity(set: SetInfo, system: IntensitySystem): string {
  switch (system) {
    case "rpe":
      return set.rpe ? `RPE ${set.rpe}` : "";
    case "rir":
      return set.rir !== undefined ? `RIR ${set.rir}` : "";
    case "one_rep_max_percent":
      return set.one_rep_max_percent ? `${set.one_rep_max_percent}% 1RM` : "";
    default:
      return "";
  }
}

function ExerciseCard({ exercise }: { exercise: WorkoutExercise }) {
  return (
    <div className="mb-4">
      <div className="pb-3">
        <h3 className="text-lg font-semibold">{exercise.name}</h3>
        {exercise.notes && (
          <p className="text-sm text-muted-foreground italic">
            {exercise.notes}
          </p>
        )}
      </div>
      <div>
        <div className="space-y-2">
          {exercise.sets.map((set, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-xs font-mono">
                  Set {index + 1}
                </Badge>
                <span className="font-semibold">{set.reps} reps</span>
                {formatIntensity(set, exercise.intensity) && (
                  <span className="text-sm text-muted-foreground">
                    {formatIntensity(set, exercise.intensity)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatRestTime(set.rest)} rest</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkoutDayTable({ day }: { day: ProgramDay }) {
  if (day.type !== "workout") return null;

  const formatIntensity = (set: SetInfo, system: IntensitySystem): string => {
    switch (system) {
      case "rpe":
        return set.rpe ? `RPE ${set.rpe}` : "";
      case "rir":
        return set.rir !== null && set.rir !== undefined
          ? `RIR ${set.rir}`
          : "";
      case "one_rep_max_percent":
        return set.one_rep_max_percent ? `${set.one_rep_max_percent}% 1RM` : "";
      default:
        return "";
    }
  };

  const formatAdvancedSetInfo = (set: SetInfo): string | null => {
    const type = set.set_type;

    switch (type) {
      case "drop":
        return set.drop_percent && set.drop_sets
          ? `Drop Set (${set.drop_percent}% x ${set.drop_sets} sets)`
          : "Drop Set";
      case "cluster":
        return set.cluster_reps && set.intra_rest
          ? `Cluster (${set.cluster_reps} reps, ${set.intra_rest}s rest)`
          : "Cluster Set";
      case "myo_reps":
        return set.activation_set_reps && set.mini_sets
          ? `Myo Reps (Start: ${set.activation_set_reps}, Mini: ${set.mini_sets})`
          : "Myo Reps";
      case "rest_pause":
        return set.initial_reps && set.pause_duration
          ? `Rest Pause (${set.initial_reps} reps, ${set.pause_duration}s pause)`
          : "Rest Pause";
      default:
        return null;
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-2">
        Day {day.order_num + 1}: {day.name}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">{day.description}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border border-muted rounded-md">
          <thead className="bg-muted text-muted-foreground uppercase font-semibold text-xs">
            <tr>
              <th className="px-4 py-2">Exercise</th>
              <th className="px-4 py-2">Sets</th>
              <th className="px-4 py-2">Reps</th>
              <th className="px-4 py-2">Intensity</th>
              <th className="px-4 py-2 w-1/2">Set Notes</th>
            </tr>
          </thead>
          <tbody>
            {day.workout.map((workout) =>
              workout.exercise_groups.map((group) =>
                group.exercises.map((exercise) => {
                  const setCount = exercise.sets.length;
                  const repRanges = [
                    ...new Set(exercise.sets.map((s) => s.reps)),
                  ].join(" / ");

                  const intensities = [
                    ...new Set(
                      exercise.sets
                        .map((s) => formatIntensity(s, exercise.intensity))
                        .filter(Boolean)
                    ),
                  ].join(", ");

                  const setTypes = [
                    ...new Set(
                      exercise.sets
                        .map((s) =>
                          s.set_type !== "standard"
                            ? formatAdvancedSetInfo(s)
                            : null
                        )
                        .filter(Boolean)
                    ),
                  ].join(" / ");

                  return (
                    <tr
                      key={exercise.id}
                      className="even:bg-muted/10 border-t border-muted"
                    >
                      <td className="px-4 py-2">{exercise.name}</td>
                      <td className="px-4 py-2">{setCount}</td>
                      <td className="px-4 py-2">{repRanges}</td>
                      <td className="px-4 py-2">{intensities || "—"}</td>
                      <td className="px-4 py-2">{exercise.notes || "—"}</td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProgramPreview({
  open,
  onOpenChange,
  program,
}: ProgramPreviewProps) {
  const GoalIcon = goalIcons[program.goal];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px] w-full px-6 py-8 rounded-2xl shadow-lg bg-white print:bg-white print:shadow-none print:rounded-none">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <DialogTitle className="text-2xl font-bold">
            Program Preview
          </DialogTitle>

          <div className="mb-6 border-b pb-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              {program.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge
                className={`${
                  goalColors[program.goal]
                } flex items-center gap-2 px-3 py-1.5 text-sm font-medium border`}
              >
                <GoalIcon className="w-4 h-4" />
                <span className="capitalize">{program.goal}</span>
              </Badge>
              <p className="text-muted-foreground text-sm">
                {program.mode === "blocks"
                  ? "Block-based program"
                  : "Day-based program"}
              </p>
            </div>
            <Separator className="my-4" />
            {program.description && (
              <RichTextRenderer
                html={program.description}
                className="w-full mt-8 text-sm leading-relaxed space-y-2 [&_p]:my-1 [&_ul]:ml-4 [&_li]:mt-0.5"
              />
            )}
          </div>

          {/* Program Structure */}
          {program.mode === "blocks" && program.blocks ? (
            <div className="space-y-8">
              {program.blocks
                .sort((a, b) => a.order_num - b.order_num)
                .map((block) => (
                  <div key={block.id}>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block text-sm font-semibold tracking-wide uppercase text-yellow-800 bg-yellow-100 px-2 py-1 rounded-md">
                          {block.name}
                        </span>
                        {block.weeks && (
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            {block.weeks} {block.weeks === 1 ? "week" : "weeks"}
                          </Badge>
                        )}
                      </div>

                      {block.description && (
                        <p className="text-muted-foreground mb-2">
                          {block.description}
                        </p>
                      )}
                      {block.weeks && (
                        <Badge variant="outline" className="mb-4">
                          {block.weeks} {block.weeks === 1 ? "week" : "weeks"}
                        </Badge>
                      )}
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                      {block.days
                        .sort((a, b) => a.order_num - b.order_num)
                        .map((day) => (
                          <WorkoutDayTable key={day.id} day={day} />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            program.days && (
              <div className="space-y-4">
                {program.days
                  .sort((a, b) => a.order_num - b.order_num)
                  .map((day) => (
                    <div key={day.id}>
                      <WorkoutDayTable key={day.id} day={day} />
                      <Separator className="mb-4" />
                    </div>
                  ))}
              </div>
            )
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
