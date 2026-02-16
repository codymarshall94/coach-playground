"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MUSCLE_DISPLAY_MAP,
  MUSCLE_NAME_MAP,
} from "@/constants/muscles";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/Exercise";
import type { WorkoutExercise, WorkoutExerciseGroup } from "@/types/Workout";
import { User } from "lucide-react";
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
          name: w.display_name,
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

  const activatedMuscles = useMemo(
    () => Array.from(new Set(allMuscles)).sort((a, b) => a.localeCompare(b)),
    [allMuscles]
  );

  const showVolumes =
    !!props.muscle_set_counts &&
    Object.keys(props.muscle_set_counts).length > 0;

  const hasAnyActivation = activatedMuscles.length > 0;

  // Simple sorted set-count entries for the volume list
  const setEntries = showVolumes
    ? Object.entries(props.muscle_set_counts!)
        .sort((a, b) => b[1] - a[1])
    : [];
  const maxSets = setEntries.length > 0 ? setEntries[0][1] : 1;

  return (
    <Card className={cn("w-full mx-auto", props.className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setViewType("anterior")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-l-md border transition-colors",
              viewType === "anterior"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
            )}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setViewType("posterior")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-r-md border transition-colors",
              viewType === "posterior"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
            )}
          >
            Back
          </button>
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

        {/* Sets per muscle — simple & glanceable */}
        {showVolumes && (
          <section className="mx-auto w-full max-w-[760px] space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sets per Muscle
            </h4>
            <ul className="space-y-1.5">
              {setEntries.map(([muscleId, sets]) => {
                const name =
                  MUSCLE_DISPLAY_MAP[
                    muscleId as keyof typeof MUSCLE_DISPLAY_MAP
                  ] ??
                  muscleId
                    .replace(/[_-]/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                const pct = Math.max(4, Math.round((sets / maxSets) * 100));
                return (
                  <li key={muscleId} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm text-foreground truncate">
                      {name}
                    </span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                      {sets}
                    </span>
                  </li>
                );
              })}
            </ul>
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
