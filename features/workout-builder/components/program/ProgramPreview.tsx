"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{exercise.name}</CardTitle>
        {exercise.notes && (
          <p className="text-sm text-muted-foreground italic">
            {exercise.notes}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exercise.sets.map((set, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="font-mono">
                  Set {index + 1}
                </Badge>
                <span className="font-semibold">{set.reps} reps</span>
                {formatIntensity(set, exercise.intensity) && (
                  <Badge variant="secondary">
                    {formatIntensity(set, exercise.intensity)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatRestTime(set.rest)} rest</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkoutDay({ day }: { day: ProgramDay }) {
  const DayIcon = dayTypeIcons[day.type];

  if (day.type === "rest") {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Coffee className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{day.name}</CardTitle>
              <p className="text-muted-foreground">{day.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Rest Day</p>
            <p className="text-sm">
              Focus on recovery, hydration, and light movement
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (day.type === "active_rest") {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{day.name}</CardTitle>
              <p className="text-muted-foreground">{day.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Active Recovery</p>
            <p className="text-sm">
              Light cardio, stretching, or mobility work
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DayIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">{day.name}</CardTitle>
            <p className="text-muted-foreground">{day.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {day.workout.map((workout, workoutIndex) => (
          <div key={workoutIndex}>
            {workout.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
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
      <DialogContent className="min-w-[800px]">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <DialogTitle className="text-2xl font-bold">
            Program Preview
          </DialogTitle>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{program.name}</h1>
              <p className="text-lg text-muted-foreground">
                {program.description}
              </p>
            </div>
            <Badge
              className={`${
                goalColors[program.goal]
              } flex items-center gap-2 px-3 py-2`}
            >
              <GoalIcon className="w-4 h-4" />
              <span className="capitalize font-medium">{program.goal}</span>
            </Badge>
          </div>

          {/* Program Structure */}
          {program.mode === "blocks" && program.blocks ? (
            <div className="space-y-8">
              {program.blocks
                .sort((a, b) => a.order - b.order)
                .map((block) => (
                  <div key={block.id}>
                    <div className="mb-6">
                      <div className="bg-yellow-400 py-2 pr-4 pl-2 w-fit">
                        <h2 className="text-2xl font-bold ">
                          {block.name.toUpperCase()}
                        </h2>
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
                    <Separator className="mb-6" />
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
                    <WorkoutDay key={day.id} day={day} />
                  ))}
              </div>
            )
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
