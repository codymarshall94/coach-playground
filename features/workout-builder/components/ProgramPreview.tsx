"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Program } from "@/types/Workout";
import {
  Calendar,
  Clock,
  Target,
  Dumbbell,
  Users,
  FileText,
} from "lucide-react";

export function ProgramPreview({ program }: { program: Program }) {
  const totalWorkoutDays = program.days.filter(
    (day) => day.type === "workout"
  ).length;
  const totalRestDays = program.days.filter(
    (day) => day.type === "rest"
  ).length;
  const totalExercises = program.days.reduce((acc, day) => {
    return acc + (day.workout?.[0]?.exercises?.length || 0);
  }, 0);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getGoalDescription = (goal: string) => {
    const descriptions = {
      strength: "Focus on maximal force production and neural adaptations",
      hypertrophy:
        "Optimize muscle growth through volume and mechanical tension",
      endurance: "Improve muscular endurance and cardiovascular capacity",
      power: "Develop explosive strength and rate of force development",
    };
    return descriptions[goal as keyof typeof descriptions] || "";
  };

  const getEquipmentList = (day: any) => {
    const equipment = new Set<string>();
    day.workout?.[0]?.exercises?.forEach((exercise: any) => {
      // This would need to be populated from exercise data
      equipment.add("Barbell"); // Placeholder - would come from exercise.equipment
    });
    return Array.from(equipment);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          Preview Program
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Training Program Overview
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-8 py-6">
            {/* Program Header */}
            <div className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
              <h1 className="text-3xl font-bold text-gray-900">
                {program.name}
              </h1>
              {program.description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {program.description}
                </p>
              )}

              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 px-3 py-1"
                  >
                    {program.goal.charAt(0).toUpperCase() +
                      program.goal.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    {program.days.length} Days
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">
                    {totalExercises} Exercises
                  </span>
                </div>
              </div>
            </div>

            {/* Program Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Program Goal
                </h3>
                <p className="text-sm text-gray-600">
                  {getGoalDescription(program.goal)}
                </p>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Training Split
                </h3>
                <p className="text-sm text-gray-600">
                  {totalWorkoutDays} workout days, {totalRestDays} rest days
                </p>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(program.createdAt)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Daily Breakdown */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Training Schedule
              </h2>

              {program.days.map((day, dayIndex) => (
                <div
                  key={day.id}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Day Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Day {dayIndex + 1}: {day.name}
                        </h3>
                        {day.description && (
                          <p className="text-gray-600 mt-1">
                            {day.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            day.type === "workout" ? "default" : "secondary"
                          }
                          className={
                            day.type === "workout"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {day.type.replace("_", " ").toUpperCase()}
                        </Badge>
                        {day.type === "workout" && (
                          <Badge variant="outline">
                            {day.workout?.[0]?.exercises?.length || 0} Exercises
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Day Content */}
                  {day.type === "workout" && day.workout?.[0]?.exercises && (
                    <div className="p-6">
                      {/* Equipment Needed */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Dumbbell className="h-4 w-4" />
                          Equipment Needed
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getEquipmentList(day).map((equipment) => (
                            <Badge
                              key={equipment}
                              variant="outline"
                              className="text-xs"
                            >
                              {equipment}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Exercises */}
                      <div className="space-y-6">
                        {day.workout[0].exercises.map(
                          (exercise, exerciseIndex) => (
                            <div
                              key={exercise.id}
                              className="border rounded-lg p-4 bg-gray-50"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    {exerciseIndex + 1}. {exercise.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {exercise.intensity.toUpperCase()}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {exercise.sets.length} sets
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Sets Table */}
                              <div className="bg-white rounded border overflow-hidden">
                                <div className="grid grid-cols-5 gap-4 p-3 bg-gray-100 text-sm font-medium text-gray-700 border-b">
                                  <div>Set</div>
                                  <div>Reps</div>
                                  <div>Intensity</div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Rest
                                  </div>
                                  <div>Notes</div>
                                </div>
                                {exercise.sets.map((set, setIndex) => (
                                  <div
                                    key={setIndex}
                                    className="grid grid-cols-5 gap-4 p-3 text-sm border-b last:border-b-0"
                                  >
                                    <div className="font-medium">
                                      {setIndex + 1}
                                    </div>
                                    <div>{set.reps}</div>
                                    <div>
                                      {exercise.intensity === "rpe" &&
                                        set.rpe &&
                                        `RPE ${set.rpe}`}
                                      {exercise.intensity === "rir" &&
                                        set.rir &&
                                        `RIR ${set.rir}`}
                                      {exercise.intensity ===
                                        "oneRepMaxPercent" &&
                                        set.oneRepMaxPercent &&
                                        `${set.oneRepMaxPercent}%`}
                                      {exercise.intensity === "none" && "-"}
                                    </div>
                                    <div>
                                      {Math.floor(set.rest / 60)}:
                                      {(set.rest % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                    </div>
                                    <div className="text-gray-500">-</div>
                                  </div>
                                ))}
                              </div>

                              {/* Exercise Summary */}
                              <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                <strong>Total Volume:</strong>{" "}
                                {exercise.sets.reduce(
                                  (acc, set) => acc + set.reps,
                                  0
                                )}{" "}
                                reps •<strong> Est. Time:</strong>{" "}
                                {Math.ceil(
                                  exercise.sets.reduce(
                                    (acc, set) => acc + set.rest,
                                    0
                                  ) / 60
                                )}{" "}
                                min
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* Day Summary */}
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Day Summary
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Sets:</span>
                            <div className="font-medium">
                              {day.workout[0].exercises.reduce(
                                (acc, ex) => acc + ex.sets.length,
                                0
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Reps:</span>
                            <div className="font-medium">
                              {day.workout[0].exercises.reduce(
                                (acc, ex) =>
                                  acc +
                                  ex.sets.reduce(
                                    (setAcc, set) => setAcc + set.reps,
                                    0
                                  ),
                                0
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Est. Duration:
                            </span>
                            <div className="font-medium">
                              {Math.ceil(
                                day.workout[0].exercises.reduce(
                                  (acc, ex) =>
                                    acc +
                                    ex.sets.reduce(
                                      (setAcc, set) => setAcc + set.rest,
                                      0
                                    ),
                                  0
                                ) / 60
                              )}{" "}
                              min
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Exercises:</span>
                            <div className="font-medium">
                              {day.workout[0].exercises.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rest Day Content */}
                  {day.type === "rest" && (
                    <div className="p-6 text-center text-gray-600">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-gray-400" />
                        <p>Scheduled rest day for recovery and adaptation</p>
                        <p className="text-sm">
                          Focus on sleep, nutrition, and light movement
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Program Footer */}
            <div className="bg-gray-50 p-6 rounded-lg border text-center">
              <p className="text-sm text-gray-600">
                Generated on {formatDate(new Date())} • Last updated{" "}
                {formatDate(program.updatedAt)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This program is designed for {program.goal} training. Adjust
                weights and intensities based on your current fitness level and
                progress.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
