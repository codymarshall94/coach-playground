"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IntensitySystem, Program, ProgramDay, SetInfo } from "@/types/Workout";
// html2canvas and jsPDF are imported dynamically in `exportToPDF`
// to avoid referencing `window` during SSR.
import { Activity, Dumbbell, Eye, Target, Zap } from "lucide-react";
import { useRef } from "react";

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

type SetGroup = { startIndex: number; count: number; set: SetInfo };

function setGroupingSignature(set: SetInfo, system: IntensitySystem) {
  // Only include fields that actually show up in the table
  return [
    set.set_type,
    set.reps,
    formatIntensity(set, system), // RPE/RIR/%1RM as displayed
    // advanced-set fields that affect the "Type" cell text
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
              <th className="px-3 py-2 text-center">Reps</th>
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
                    <td colSpan={6} className="px-3 py-2">
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
                      <td className="px-3 py-2 text-center">{g.set.reps}</td>
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
  return (
    <div className="p-6 bg-white text-[13px] leading-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{program.name}</h1>
      <div className="flex items-center gap-3 mt-2">
        <Badge
          className={`${
            goalColors[program.goal]
          } flex items-center gap-2 px-3 py-1.5 text-sm font-medium border`}
        >
          <GoalIcon className="w-4 h-4" />
          <span className="capitalize">{program.goal}</span>
        </Badge>
        <span className="text-muted-foreground text-sm">
          {program.mode === "blocks"
            ? "Block-based program"
            : "Day-based program"}
        </span>
      </div>
      <Separator className="my-4" />
      {program.description && (
        <div className="w-full mt-2 text-sm  space-y-2 prose">
          <div dangerouslySetInnerHTML={{ __html: program.description }} />
        </div>
      )}

      {program.mode === "blocks" && program.blocks ? (
        <div className="space-y-8">
          {program.blocks
            .sort((a, b) => a.order_num - b.order_num)
            .map((block) => (
              <div key={block.id}>
                <div className="mb-4">
                  <span className="inline-block text-xs font-semibold tracking-wide uppercase text-yellow-800 bg-yellow-100 px-2 py-1 rounded-md">
                    {block.name}
                  </span>
                  {block.weeks && (
                    <Badge
                      variant="outline"
                      className="text-xs font-medium ml-2"
                    >
                      {block.weeks} {block.weeks === 1 ? "week" : "weeks"}
                    </Badge>
                  )}
                </div>
                <Separator className="mb-3" />
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
                  <WorkoutDayTable day={day} />
                  <Separator className="mb-4" />
                </div>
              ))}
          </div>
        )
      )}
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
  const captureRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!captureRef.current) return;

    // Dynamically import client-only libs to prevent SSR errors
    const html2canvas = (await import("html2canvas-pro")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(captureRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Additional pages if needed
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${program.name}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[800px] w-full px-6 py-8 rounded-2xl shadow-lg bg-white">
        <div className="mb-4 flex justify-end">
          <Button onClick={exportToPDF}>Export to PDF</Button>
        </div>

        <ScrollArea className="h-[calc(100vh-260px)]">
          <ProgramSheet program={program} />
        </ScrollArea>

        <div
          ref={captureRef}
          style={{
            position: "fixed",
            left: -10000,
            top: 0,
            width: "794px",
            background: "#fff",
            zIndex: -1,
          }}
          aria-hidden
        >
          <ProgramSheet program={program} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
