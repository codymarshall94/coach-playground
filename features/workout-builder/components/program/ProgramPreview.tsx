"use client";

import { RichTextRenderer } from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
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

export function WorkoutDay({ day }: { day: ProgramDay }) {
  const DayIcon = dayTypeIcons[day.type];

  if (day.type === "rest") {
    return (
      <div className="rounded-xl border border-muted p-4 bg-background/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Coffee className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl">{day.name}</h2>
              <p className="text-muted-foreground">{day.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (day.type === "active_rest") {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                Day {day.order + 1}
              </h3>
              <p className="text-sm text-muted-foreground">{day.description}</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Active Recovery</p>
            <p className="text-sm">
              Light cardio, stretching, or mobility work
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-muted p-4 bg-background/50 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DayIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">{day.name}</CardTitle>
            <p className="text-muted-foreground">{day.description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {day.workout.map((workout, workoutIndex) => (
          <div key={workoutIndex}>
            {workout.exercise_groups.map((group) => (
              <div key={group.id}>
                {group.exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProgramPreview({ program }: ProgramPreviewProps) {
  const GoalIcon = goalIcons[program.goal];

  return (
    <Dialog>
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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold leading-tight">
                  {program.name}
                </h1>
                <Badge
                  className={`${
                    goalColors[program.goal]
                  } flex items-center gap-2 px-3 py-1.5 text-sm font-medium border`}
                >
                  <GoalIcon className="w-4 h-4" />
                  <span className="capitalize">{program.goal}</span>
                </Badge>
              </div>
              <RichTextRenderer html={program.description} />
            </div>
          </div>

          {/* Program Structure */}
          {program.mode === "blocks" && program.blocks ? (
            <div className="space-y-8">
              {program.blocks
                .sort((a, b) => a.order - b.order)
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
                        .sort((a, b) => a.order - b.order)
                        .map((day) => (
                          <WorkoutDay key={day.id} day={day} />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            program.days && (
              <div className="space-y-4">
                {program.days
                  .sort((a, b) => a.order - b.order)
                  .map((day) => (
                    <div key={day.id}>
                      <WorkoutDay key={day.id} day={day} />
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
