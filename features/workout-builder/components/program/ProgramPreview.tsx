"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import DOMPurify from "dompurify";
import { IntensitySystem, Program, ProgramDay, RepSchemeType, SetInfo } from "@/types/Workout";
import { Activity, Dumbbell, Eye, Target, Zap } from "lucide-react";
import { PROGRAM_GRADIENTS } from "@/features/workout-builder/components/program/ProgramSettingsSheet";

const goalIcons = {
  strength: Zap,
  hypertrophy: Dumbbell,
  endurance: Activity,
  power: Target,
};

function formatRestTime(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}
function formatIntensity(set: SetInfo, system: IntensitySystem) {
  switch (system) {
    case "rpe":
      return set.rpe ? `RPE ${set.rpe}` : "";
    case "rir":
      return set.rir ?? set.rir === 0 ? `RIR ${set.rir}` : "";
    case "one_rep_max_percent":
      return set.one_rep_max_percent ? `${set.one_rep_max_percent}% 1RM` : "";
    default:
      return "";
  }
}
function formatAdvancedSetInfo(set: SetInfo): string {
  const base =
    set.set_type !== "standard" ? set.set_type.replace("_", " ") : "Standard";
  switch (set.set_type) {
    case "drop":
      return `${base}\n(${set.drop_percent ?? "?"}% x ${
        set.drop_sets ?? "?"
      } sets)`;
    case "cluster":
      return `${base}\n(${set.cluster_reps ?? "?"} reps, ${
        set.intra_rest ?? "?"
      }s rest)`;
    case "myo_reps":
      return `${base}\n(Start: ${set.activation_set_reps ?? "?"}, Mini: ${
        set.mini_sets ?? "?"
      })`;
    case "rest_pause":
      return `${base}\n(${set.initial_reps ?? "?"} reps, ${
        set.pause_duration ?? "?"
      }s pause)`;
    default:
      return base;
  }
}

/** Render the "Rx" cell: handles rep ranges, time, distance, per-side, AMRAP */
function formatPrescription(
  set: SetInfo,
  exerciseRepScheme?: RepSchemeType
): string {
  const scheme = set.rep_scheme ?? exerciseRepScheme ?? "fixed";
  switch (scheme) {
    case "time":
      return set.duration ? formatRestTime(set.duration) : `${set.reps}`;
    case "range":
      return set.reps_max ? `${set.reps}–${set.reps_max}` : `${set.reps}`;
    case "each_side":
      return `${set.reps}/side`;
    case "amrap":
      return "AMRAP";
    case "distance":
      return set.distance != null ? `${set.distance}m` : `${set.reps}`;
    case "fixed":
    default: {
      let text = `${set.reps}`;
      if (set.per_side) text += "/side";
      return text;
    }
  }
}

type SetGroup = { startIndex: number; count: number; set: SetInfo };

function setGroupingSignature(set: SetInfo, system: IntensitySystem) {
  // Include every field that affects any visible cell so different sets
  // are never incorrectly collapsed into one row.
  return [
    set.set_type,
    set.reps,
    set.reps_max,
    set.rep_scheme,
    set.duration,
    set.distance,
    set.per_side,
    set.rest,
    formatIntensity(set, system),
    // advanced-set fields
    set.drop_percent,
    set.drop_sets,
    set.cluster_reps,
    set.intra_rest,
    set.activation_set_reps,
    set.mini_sets,
    set.initial_reps,
    set.pause_duration,
  ].join("|");
}

function groupConsecutiveSets(
  sets: SetInfo[],
  system: IntensitySystem
): SetGroup[] {
  const groups: SetGroup[] = [];
  let i = 0;
  while (i < sets.length) {
    const sig = setGroupingSignature(sets[i], system);
    let j = i + 1;
    while (j < sets.length && setGroupingSignature(sets[j], system) === sig)
      j++;
    groups.push({ startIndex: i, count: j - i, set: sets[i] });
    i = j;
  }
  return groups;
}

function WorkoutDayTable({ day }: { day: ProgramDay }) {
  if (day.type !== "workout") return null;
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-2">
        Day {day.order_num + 1}: {day.name}
      </h2>
      {day.description && (
        <p className="text-sm text-muted-foreground mb-4">{day.description}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 rounded-md">
          <thead className="bg-gray-100 uppercase text-xs font-semibold tracking-wide">
            <tr>
              <th className="px-3 py-2">Exercise</th>
              <th className="px-3 py-2 text-center">Set</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2 text-center">Rx</th>
              <th className="px-3 py-2 text-center">Rest</th>
              <th className="px-3 py-2 text-center">Intensity</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {day.groups.map((group, groupIndex) => {
                const groupRow = (
                  <tr
                    key={`group-${groupIndex}`}
                    className="bg-gray-50 font-medium border-t border-gray-300"
                  >
                    <td colSpan={7} className="px-3 py-2">
                      {group.type !== "standard" && (
                        <span className="capitalize font-semibold">
                          {group.type.replace("_", " ")}
                        </span>
                      )}
                      {group.rest_after_group && (
                        <span className="ml-4 text-xs text-gray-500">
                          ⏱ Rest after group:{" "}
                          {formatRestTime(group.rest_after_group)}
                        </span>
                      )}
                      {group.notes && (
                        <span className="ml-4 italic text-xs">
                          {group.notes}
                        </span>
                      )}
                    </td>
                  </tr>
                );

                const exerciseRows = group.exercises.flatMap((exercise) => {
                  const groups = groupConsecutiveSets(
                    exercise.sets,
                    exercise.intensity
                  );
                  const rowSpan = groups.length;

                  return groups.map((g, gi) => (
                    <tr
                      key={`${exercise.id}-grp-${g.startIndex}`}
                      className={`${
                        gi % 2 ? "bg-gray-50" : "bg-white"
                      } border-t border-gray-200`}
                    >
                      {gi === 0 && (
                        <td
                          rowSpan={rowSpan}
                          className="px-3 py-2 font-semibold align-top"
                        >
                          {exercise.display_name}
                        </td>
                      )}

                      <td className="px-3 py-2 text-center">
                        {g.count > 1 ? `×${g.count}` : `${g.startIndex + 1}`}
                      </td>

                      <td className="px-3 py-2 whitespace-pre-line">
                        {formatAdvancedSetInfo(g.set)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {formatPrescription(g.set, exercise.rep_scheme)}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-gray-500">
                        {g.set.rest ? formatRestTime(g.set.rest) : "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {formatIntensity(g.set, exercise.intensity) || "—"}
                      </td>

                      {gi === 0 && (
                        <td
                          rowSpan={rowSpan}
                          className="px-3 py-2 text-xs text-gray-600 italic align-top"
                        >
                          {exercise.notes || "—"}
                        </td>
                      )}
                    </tr>
                  ));
                });

                return [groupRow, ...exerciseRows];
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProgramSheet({ program }: { program: Program }) {
  const GoalIcon = goalIcons[program.goal];
  const gradient = PROGRAM_GRADIENTS[program.goal];
  const totalWeeks = program.mode === "blocks" && program.blocks
    ? program.blocks.reduce((sum, b) => sum + (Array.isArray(b.weeks) ? b.weeks.length : b.weekCount ?? 1), 0)
    : null;
  const totalDays = program.mode === "blocks" && program.blocks
    ? program.blocks.reduce((sum, b) => sum + (b.days?.length ?? 0), 0)
    : program.days?.length ?? 0;

  return (
    <div className="bg-white text-[13px] leading-6">
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden px-6 pt-8 pb-6" style={{ background: gradient }}>
        {/* Decorative icon */}
        <GoalIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/[0.06]" />
        <div className="relative z-10">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">
            {program.mode === "blocks" ? "Block-based program" : "Day-based program"}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">{program.name}</h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
              <GoalIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{program.goal}</span>
            </div>
            {totalWeeks && (
              <span className="text-white/50 text-xs font-medium">{totalWeeks} weeks</span>
            )}
            <span className="text-white/50 text-xs font-medium">{totalDays} training days{program.mode === "blocks" ? " / block" : ""}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
      {program.description && (
        <div className="w-full mt-4 text-sm space-y-2 prose text-gray-600">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(program.description) }} />
        </div>
      )}

      {program.mode === "blocks" && program.blocks ? (
        <div className="space-y-8">
          {program.blocks
            .sort((a, b) => a.order_num - b.order_num)
            .map((block, bi) => {
              const weekCount = Array.isArray(block.weeks) ? block.weeks.length : block.weekCount ?? 1;
              return (
              <div key={block.id}>
                <div className="overflow-hidden mb-4">
                  <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold tracking-widest uppercase opacity-50">Block {bi + 1}</span>
                      <span className="text-sm font-semibold tracking-wide uppercase">{block.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {weekCount} {weekCount === 1 ? "week" : "weeks"}
                    </span>
                  </div>
                  {block.description && (
                    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-xs">
                      {block.description}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {Array.isArray(block.weeks) && block.weeks.length > 0
                    ? block.weeks
                        .sort((a, b) => a.weekNumber - b.weekNumber)
                        .map((week) => (
                          <div key={week.id}>
                            <div className="flex items-center gap-3 mb-3 mt-2">
                              <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
                                Week {week.weekNumber}
                                {week.label ? ` — ${week.label}` : ""}
                              </span>
                              <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <div className="space-y-4">
                              {week.days
                                .sort((a, b) => a.order_num - b.order_num)
                                .map((day) => (
                                  <WorkoutDayTable key={day.id} day={day} />
                                ))}
                            </div>
                          </div>
                        ))
                    : block.days
                        .sort((a, b) => a.order_num - b.order_num)
                        .map((day) => (
                          <WorkoutDayTable key={day.id} day={day} />
                        ))}
                </div>
              </div>
              );
            })}
        </div>
      ) : (
        program.days && (
          <div className="space-y-4">
            {program.days
              .sort((a, b) => a.order_num - b.order_num)
              .map((day) => (
                <div key={day.id}>
                  <WorkoutDayTable day={day} />
                  <Separator className="mb-4" />
                </div>
              ))}
          </div>
        )
      )}
      </div>
    </div>
  );
}

export default function ProgramPreview({
  open,
  onOpenChange,
  program,
}: {
  program: Program;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const exportToPDF = async () => {
    const res = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(program),
    });

    if (!res.ok) {
      console.error("PDF export failed:", await res.text());
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${program.name}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[800px] w-full px-6 py-8 rounded-2xl shadow-lg bg-white">
        <DialogTitle className="sr-only">Program preview</DialogTitle>
        <div className="mb-4 flex justify-end">
          <Button onClick={exportToPDF}>Export to PDF</Button>
        </div>

        <ScrollArea className="h-[calc(100vh-260px)]">
          <ProgramSheet program={program} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
