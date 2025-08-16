"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BACK_MUSCLES,
  FRONT_MUSCLES,
  MUSCLE_DISPLAY_MAP,
  MUSCLE_NAME_MAP,
} from "@/constants/muscles";
import { MuscleVolumeRow } from "@/features/workout-builder/components/insights/MuscleVolumeRow";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/Exercise";
import type { WorkoutExercise, WorkoutExerciseGroup } from "@/types/Workout";
import { RotateCcw, User, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import Model, { type Muscle } from "react-body-highlighter";

/** ---------- Props (two modes) ---------- */
type BaseProps = {
  muscle_volumes?: Record<string, number>;
  muscle_set_counts?: Record<string, number>;
  maxVolume?: number;
  workout?: WorkoutExerciseGroup[];
  height?: number;
  className?: string;
};

type WorkoutModeProps = BaseProps & {
  mode: "workout";
  workoutExercises: WorkoutExercise[];
  exercises: Exercise[];
};

type LibraryModeProps = BaseProps & {
  mode: "library";
  exerciseMetas: Exercise[];
  intensityFrom?: "avg" | "max" | "constant";
  constantIntensity?: number; // 1..5
};

type Props = WorkoutModeProps | LibraryModeProps;

/** Map joined rows -> react-body-highlighter muscle keys */
type Joined = { contribution?: number | null; muscles: { id: string } };

const mapJoinedToMuscles = (ems: Joined[]): Muscle[] =>
  ems
    .map((em) => MUSCLE_NAME_MAP[em.muscles.id as keyof typeof MUSCLE_NAME_MAP])
    .filter((v): v is Muscle => Boolean(v));

/** Convert contributions -> 1..5 bucket for color */
const contributionsToBucket = (
  ems: Joined[],
  strategy: "avg" | "max" | "constant",
  constantIntensity?: number
) => {
  if (strategy === "constant")
    return Math.max(1, Math.min(5, constantIntensity ?? 3));
  const vals = ems.map((em) => Number(em.contribution ?? 0));
  if (!vals.length) return 1;
  const x =
    strategy === "max"
      ? Math.max(...vals)
      : vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.max(1, Math.min(5, Math.round(x * 5)));
};

const colorWithBucket = (b: number) =>
  `rgba(59, 130, 246, ${Math.min(0.2 + b * 0.15, 0.9)})`;

export default function MuscleHeatmap(props: Props) {
  // Default the first view to the side with more muscles highlighted.
  const [viewType, setViewType] = useState<"anterior" | "posterior">(
    "anterior"
  );
  const height = props.height ?? 440;

  /** Build highlight data */
  const highlightData = useMemo(() => {
    if (props.mode === "workout") {
      const { workoutExercises, exercises } = props;
      return workoutExercises.map((w) => {
        const ex = exercises.find((e) => e.id === w.exercise_id);
        const ems = ex?.exercise_muscles ?? [];
        return {
          name: w.name,
          muscles: mapJoinedToMuscles(ems),
          // for workout view you're already using set count as intensity
          color: colorWithBucket(Math.max(1, Math.min(5, w.sets.length))),
        };
      });
    } else {
      const { exerciseMetas, intensityFrom = "avg", constantIntensity } = props;
      return exerciseMetas.map((e) => {
        const ems = e.exercise_muscles ?? [];
        return {
          name: e.name,
          muscles: mapJoinedToMuscles(ems),
          color: colorWithBucket(
            contributionsToBucket(ems, intensityFrom, constantIntensity)
          ),
        };
      });
    }
  }, [props]);

  const allMuscles = useMemo(
    () => highlightData.flatMap((d) => d.muscles),
    [highlightData]
  );

  const frontCount = useMemo(
    () => allMuscles.filter((m) => FRONT_MUSCLES.includes(m)).length,
    [allMuscles]
  );
  const backCount = useMemo(
    () => allMuscles.filter((m) => BACK_MUSCLES.includes(m)).length,
    [allMuscles]
  );

  const activatedMuscles = useMemo(
    () => Array.from(new Set(allMuscles)).sort((a, b) => a.localeCompare(b)),
    [allMuscles]
  );

  const showVolumes =
    !!props.muscle_volumes &&
    !!props.muscle_set_counts &&
    typeof props.maxVolume === "number" &&
    !!props.workout;

  const hasAnyActivation = activatedMuscles.length > 0;

  return (
    <Card className={cn("w-full mx-auto", props.className)}>
      <CardHeader className="pb-3 @container">
        <div className=" flex items-center @md:flex-row flex-col justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <UserCheck className="h-4 w-4 text-primary" />
            </span>
            <div>
              <CardTitle className="text-lg">Muscle Activation</CardTitle>
              <p className="text-xs text-muted-foreground">
                Visualize which regions your selection targets, at a glance.
              </p>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Body view"
            className="flex rounded-lg border bg-muted/50 p-1"
          >
            <Button
              role="tab"
              aria-selected={viewType === "anterior"}
              variant={viewType === "anterior" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("anterior")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Front</span>
              <span
                className={cn(
                  "ml-1 text-xs rounded px-1.5 py-0.5 bg-background/60 border",
                  viewType === "anterior" && "bg-primary/10"
                )}
              >
                {frontCount}
              </span>
            </Button>
            <Button
              role="tab"
              aria-selected={viewType === "posterior"}
              variant={viewType === "posterior" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("posterior")}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
              <span
                className={cn(
                  "ml-1 text-xs rounded px-1.5 py-0.5 bg-background/60 border",
                  viewType === "posterior" && "bg-primary/10"
                )}
              >
                {backCount}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Canvas */}
        <div className="mx-auto w-full max-w-[760px]">
          <div
            className={cn(
              "relative rounded-2xl border bg-gradient-to-b from-background to-muted/60",
              "shadow-sm ring-1 ring-black/5"
            )}
          >
            <div className="absolute inset-0 rounded-2xl [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)] pointer-events-none" />
            <div className="p-6 md:p-8">
              {hasAnyActivation ? (
                <div className="flex items-center justify-center">
                  <Model
                    data={highlightData}
                    style={{ width: "auto", height, maxWidth: "100%" }}
                    bodyColor="#e5e7eb"
                    type={viewType}
                  />
                </div>
              ) : (
                <EmptyHeatmapState height={height} />
              )}
            </div>
          </div>
        </div>

        {/* Legend + tags */}
        <section className="mx-auto w-full max-w-[760px] space-y-6">
          {/* Legend */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              {/* stepped bar for accessibility (5 buckets) */}
              <div className="grid grid-cols-5 h-2 gap-[2px]">
                {[1, 2, 3, 4, 5].map((b) => (
                  <div
                    key={b}
                    className="rounded-full"
                    style={{ backgroundColor: colorWithBucket(b) }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          {hasAnyActivation && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Targeted Muscle Groups</h3>
              <div className="flex flex-wrap gap-2">
                {activatedMuscles.map((m) => {
                  const pretty =
                    MUSCLE_DISPLAY_MAP[m as keyof typeof MUSCLE_DISPLAY_MAP] ??
                    m
                      .replace("-", " ")
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                  return (
                    <Badge
                      key={m}
                      variant="secondary"
                      className="rounded-full bg-primary/5 text-foreground border-primary/15"
                    >
                      {pretty}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Volumes (optional) */}
        {showVolumes && (
          <section className="mx-auto w-full max-w-[760px] space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Muscle Group Volumes
            </h4>
            <div className="grid gap-2">
              {Object.entries(props.muscle_volumes!).map(
                ([muscle, volume], index) => (
                  <MuscleVolumeRow
                    key={muscle}
                    index={index}
                    muscleId={muscle}
                    setCount={props.muscle_set_counts![muscle]}
                    weightedVolume={volume}
                    maxVolume={props.maxVolume!}
                    workout={props.workout!.flatMap((g) => g.exercises)}
                    exercises={
                      props.mode === "workout" ? props.exercises ?? [] : []
                    }
                  />
                )
              )}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyHeatmapState({ height }: { height: number }) {
  return (
    <div
      className="grid place-items-center rounded-xl bg-muted/40 border border-dashed"
      style={{ height }}
    >
      <div className="text-center space-y-2 p-6">
        <div className="mx-auto h-9 w-9 rounded-full bg-muted/70 grid place-items-center ring-1 ring-border">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No activation data available.
        </p>
      </div>
    </div>
  );
}
