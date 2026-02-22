"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IntensitySystem,
  Program,
  ProgramDay,
  RepSchemeType,
  SetInfo,
} from "@/types/Workout";
import {
  PDFLayoutConfig,
  PDFTheme,
  PDF_THEMES,
} from "@/types/PDFLayout";
import DOMPurify from "dompurify";
import { Activity, Dumbbell, Target, Zap } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Font size / density maps
// ─────────────────────────────────────────────────────────────────────────────

const FONT_SIZE_MAP = {
  small: { body: "text-xs", table: "text-xs", heading: "text-base", hero: "text-2xl" },
  medium: { body: "text-sm", table: "text-sm", heading: "text-lg", hero: "text-3xl" },
  large: { body: "text-base", table: "text-base", heading: "text-xl", hero: "text-4xl" },
} as const;

const DENSITY_MAP = {
  compact: { cellPy: "py-1", cellPx: "px-2", sectionGap: "mb-4" },
  normal: { cellPy: "py-2", cellPx: "px-3", sectionGap: "mb-8" },
  spacious: { cellPy: "py-3", cellPx: "px-4", sectionGap: "mb-12" },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Shared formatting helpers
// ─────────────────────────────────────────────────────────────────────────────

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
      return set.rpe != null ? `RPE ${set.rpe}` : "";
    case "rir":
      return set.rir != null ? `RIR ${set.rir}` : "";
    case "one_rep_max_percent":
      return set.one_rep_max_percent ? `${set.one_rep_max_percent}% 1RM` : "";
    default:
      return "";
  }
}

const SET_TYPE_LABELS: Record<string, string> = {
  standard: "Standard",
  warmup: "Warmup",
  amrap: "AMRAP",
  drop: "Drop Set",
  cluster: "Cluster",
  myo_reps: "Myo-Reps",
  rest_pause: "Rest-Pause",
  top_set: "Top Set",
  backoff: "Backoff",
};

function formatAdvancedSetInfo(set: SetInfo): string {
  const label =
    SET_TYPE_LABELS[set.set_type] ?? set.set_type.replace("_", " ");
  switch (set.set_type) {
    case "drop":
      return `${label}\n(${set.drop_percent ?? "?"}% × ${set.drop_sets ?? "?"} drops)`;
    case "cluster":
      return `${label}\n(${set.cluster_reps ?? "?"} reps, ${set.intra_rest ?? "?"}s rest)`;
    case "myo_reps":
      return `${label}\n(Start: ${set.activation_set_reps ?? "?"}, Mini: ${set.mini_sets ?? "?"})`;
    case "rest_pause":
      return `${label}\n(${set.initial_reps ?? "?"} reps, ${set.pause_duration ?? "?"}s pause)`;
    default:
      return label;
  }
}

function formatPrescription(
  set: SetInfo,
  exerciseRepScheme?: RepSchemeType
): string {
  const scheme = set.rep_scheme ?? exerciseRepScheme ?? "fixed";
  const side = set.per_side ? " e/s" : "";
  switch (scheme) {
    case "time":
      return (
        (set.duration ? formatRestTime(set.duration) : `${set.reps}`) + side
      );
    case "range":
      return (
        (set.reps_max ? `${set.reps}–${set.reps_max}` : `${set.reps}`) + side
      );
    case "each_side":
      return `${set.reps} e/s`;
    case "amrap":
      return `AMRAP${side}`;
    case "distance":
      return (
        (set.distance != null ? `${set.distance}m` : `${set.reps}`) + side
      );
    case "fixed":
    default:
      return `${set.reps}${side}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Set grouping
// ─────────────────────────────────────────────────────────────────────────────

interface SetGroup {
  startIndex: number;
  count: number;
  set: SetInfo;
}

function setGroupingSignature(set: SetInfo, system: IntensitySystem) {
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
    set.drop_percent,
    set.drop_sets,
    set.cluster_reps,
    set.intra_rest,
    set.activation_set_reps,
    set.mini_sets,
    set.initial_reps,
    set.pause_duration,
    set.notes,
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

// ─────────────────────────────────────────────────────────────────────────────
// Theme-driven sub-components
// ─────────────────────────────────────────────────────────────────────────────

function resolveTheme(config: PDFLayoutConfig): PDFTheme {
  const base = PDF_THEMES[config.themeId];
  if (!config.accentColor) return base;
  // When a custom accent is set, override the hero background with it
  return {
    ...base,
    heroBg: config.accentColor,
    heroGradient: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}dd 100%)`,
  };
}

/** Determine which columns are visible and their headers */
function visibleColumns(config: PDFLayoutConfig) {
  const cols: { key: string; header: string; center?: boolean }[] = [
    { key: "exercise", header: "Exercise" },
    { key: "set", header: "Set", center: true },
  ];
  if (config.showSetType) cols.push({ key: "type", header: "Type" });
  cols.push({ key: "rx", header: "Rx", center: true });
  if (config.showRest) cols.push({ key: "rest", header: "Rest", center: true });
  if (config.showIntensity)
    cols.push({ key: "intensity", header: "Intensity", center: true });
  if (config.showNotes) cols.push({ key: "notes", header: "Notes" });
  return cols;
}

function WorkoutDayTable({
  day,
  theme,
  config,
}: {
  day: ProgramDay;
  theme: PDFTheme;
  config: PDFLayoutConfig;
}) {
  if (day.type !== "workout") return null;
  const cols = visibleColumns(config);
  const fonts = FONT_SIZE_MAP[config.fontSize];
  const density = DENSITY_MAP[config.tableDensity];

  return (
    <div className={density.sectionGap}>
      <h2 className={`${fonts.heading} font-bold mb-1`} style={{ color: theme.bodyText }}>
        Day {day.order_num + 1}: {day.name}
      </h2>
      {day.description && config.showDescription && (
        <p className="text-xs mb-3" style={{ color: theme.mutedText }}>
          {day.description}
        </p>
      )}

      <div className="overflow-x-auto">
        <table
          className={`w-full ${fonts.table} rounded-md`}
          style={{ borderColor: theme.borderColor, borderWidth: 1 }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: theme.tableHeaderBg,
                color: theme.tableHeaderText,
              }}
            >
              {cols.map((col) => (
                <th
                  key={col.key}
                  className={`${density.cellPx} ${density.cellPy} text-xs font-semibold tracking-wide uppercase ${col.center ? "text-center" : "text-left"}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {day.groups.map((group, groupIndex) => {
              // Group header row
              const groupRow =
                group.type !== "standard" ||
                group.rest_after_group ||
                group.notes ? (
                  <tr
                    key={`group-${groupIndex}`}
                    style={{
                      borderTopWidth: 1,
                      borderColor: theme.borderColor,
                      backgroundColor: theme.tableAltRowBg,
                    }}
                  >
                    <td
                      colSpan={cols.length}
                      className={`${density.cellPx} ${density.cellPy} font-medium`}
                      style={{ color: theme.bodyText }}
                    >
                      {group.type !== "standard" && (
                        <span className="capitalize font-semibold">
                          {group.type.replace("_", " ")}
                        </span>
                      )}
                      {group.rest_after_group && (
                        <span
                          className="ml-4 text-xs"
                          style={{ color: theme.mutedText }}
                        >
                          ⏱ Rest after group:{" "}
                          {formatRestTime(group.rest_after_group)}
                        </span>
                      )}
                      {group.notes && (
                        <span
                          className="ml-4 italic text-xs"
                          style={{ color: theme.mutedText }}
                        >
                          {group.notes}
                        </span>
                      )}
                    </td>
                  </tr>
                ) : null;

              // Exercise rows
              const exerciseRows = group.exercises.flatMap((exercise) => {
                let filteredSets = exercise.sets;
                if (!config.showWarmupSets) {
                  filteredSets = filteredSets.filter(
                    (s) => s.set_type !== "warmup"
                  );
                }
                if (filteredSets.length === 0) return [];

                const groups = groupConsecutiveSets(
                  filteredSets,
                  exercise.intensity
                );

                return groups.map((g, gi) => {
                  const noteParts: string[] = [];
                  if (gi === 0 && exercise.notes)
                    noteParts.push(exercise.notes);
                  if (g.set.notes) noteParts.push(g.set.notes);

                  const cells: React.ReactNode[] = [];

                  // Exercise name
                  cells.push(
                    <td
                      key="exercise"
                      className={`${density.cellPx} ${density.cellPy} font-semibold align-top`}
                      style={{ color: theme.bodyText }}
                    >
                      {gi === 0 ? exercise.display_name : ""}
                    </td>
                  );

                  // Set number
                  cells.push(
                    <td
                      key="set"
                      className={`${density.cellPx} ${density.cellPy} text-center`}
                      style={{ color: theme.bodyText }}
                    >
                      {g.count > 1
                        ? `×${g.count}`
                        : `${g.startIndex + 1}`}
                    </td>
                  );

                  // Type
                  if (config.showSetType) {
                    cells.push(
                      <td
                        key="type"
                        className={`${density.cellPx} ${density.cellPy} whitespace-pre-line`}
                        style={{ color: theme.bodyText }}
                      >
                        {formatAdvancedSetInfo(g.set)}
                      </td>
                    );
                  }

                  // Rx
                  cells.push(
                    <td
                      key="rx"
                      className={`${density.cellPx} ${density.cellPy} text-center`}
                      style={{ color: theme.bodyText }}
                    >
                      {formatPrescription(g.set, exercise.rep_scheme)}
                    </td>
                  );

                  // Rest
                  if (config.showRest) {
                    cells.push(
                      <td
                        key="rest"
                        className={`${density.cellPx} ${density.cellPy} text-center text-xs`}
                        style={{ color: theme.mutedText }}
                      >
                        {g.set.rest ? formatRestTime(g.set.rest) : "—"}
                      </td>
                    );
                  }

                  // Intensity
                  if (config.showIntensity) {
                    cells.push(
                      <td
                        key="intensity"
                        className={`${density.cellPx} ${density.cellPy} text-center`}
                        style={{ color: theme.bodyText }}
                      >
                        {formatIntensity(g.set, exercise.intensity) || "—"}
                      </td>
                    );
                  }

                  // Notes
                  if (config.showNotes) {
                    cells.push(
                      <td
                        key="notes"
                        className={`${density.cellPx} ${density.cellPy} text-xs italic align-top`}
                        style={{ color: theme.mutedText }}
                      >
                        {noteParts.length > 0
                          ? noteParts.join(" · ")
                          : gi === 0
                            ? "—"
                            : ""}
                      </td>
                    );
                  }

                  return (
                    <tr
                      key={`${exercise.id}-grp-${g.startIndex}`}
                      style={{
                        backgroundColor:
                          gi % 2 ? theme.tableAltRowBg : theme.bodyBg,
                        borderTopWidth: 1,
                        borderColor: theme.borderColor,
                      }}
                    >
                      {cells}
                    </tr>
                  );
                });
              });

              return [groupRow, ...exerciseRows];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main themed preview sheet
// ─────────────────────────────────────────────────────────────────────────────

export function PDFPreviewSheet({
  program,
  config,
}: {
  program: Program;
  config: PDFLayoutConfig;
}) {
  const theme = resolveTheme(config);
  const GoalIcon = goalIcons[program.goal];
  const fonts = FONT_SIZE_MAP[config.fontSize];

  const totalWeeks =
    program.mode === "blocks" && program.blocks
      ? program.blocks.reduce(
          (sum, b) =>
            sum +
            (Array.isArray(b.weeks) ? b.weeks.length : b.weekCount ?? 1),
          0
        )
      : null;
  const totalDays =
    program.mode === "blocks" && program.blocks
      ? program.blocks.reduce((sum, b) => sum + (b.days?.length ?? 0), 0)
      : program.days?.length ?? 0;

  return (
    <ScrollArea className="h-full">
      {/* A4-ish container for the preview */}
      <div className="mx-auto max-w-[816px] shadow-xl border border-border/50 rounded-lg overflow-hidden my-6">
        <div style={{ backgroundColor: theme.bodyBg }} className="text-[13px] leading-6">
          {/* ── Cover / Hero header ── */}
          {config.showCoverPage && (
            <div
              className="relative overflow-hidden px-8 pt-10 pb-8"
              style={{ background: theme.heroGradient }}
            >
              {/* Decorative icon */}
              <GoalIcon
                className="absolute -bottom-4 -right-4 w-32 h-32"
                style={{ color: `${theme.heroText}08` }}
              />
              <div className="relative z-10">
                {/* Branding */}
                {config.branding.coachName && (
                  <div className="mb-4">
                    <span
                      className="text-sm font-bold tracking-wide"
                      style={{ color: theme.heroAccent }}
                    >
                      {config.branding.coachName}
                    </span>
                    {config.branding.tagline && (
                      <span
                        className="ml-3 text-xs italic"
                        style={{ color: `${theme.heroText}80` }}
                      >
                        {config.branding.tagline}
                      </span>
                    )}
                  </div>
                )}

                <span
                  className="text-[11px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: `${theme.heroText}50` }}
                >
                  {program.mode === "blocks"
                    ? "Block-based program"
                    : "Day-based program"}
                </span>
                <h1
                  className={`${fonts.hero} font-extrabold tracking-tight mt-1`}
                  style={{ color: theme.heroText }}
                >
                  {program.name}
                </h1>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <GoalIcon
                      className="w-3.5 h-3.5"
                      style={{ color: theme.heroAccent }}
                    />
                    <span
                      className="capitalize"
                      style={{ color: theme.heroAccent }}
                    >
                      {program.goal}
                    </span>
                  </div>
                  {totalWeeks && (
                    <span
                      className="text-xs font-medium"
                      style={{ color: `${theme.heroText}50` }}
                    >
                      {totalWeeks} weeks
                    </span>
                  )}
                  <span
                    className="text-xs font-medium"
                    style={{ color: `${theme.heroText}50` }}
                  >
                    {totalDays} training days
                    {program.mode === "blocks" ? " / block" : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Body ── */}
          <div className={`px-8 pb-8 pt-4 ${fonts.body}`}>
            {program.description && config.showDescription && (
              <div
                className="w-full mb-6 text-sm space-y-2 prose"
                style={{ color: theme.mutedText }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(program.description),
                  }}
                />
              </div>
            )}

            {/* Block mode */}
            {program.mode === "blocks" && program.blocks ? (
              <div className="space-y-8">
                {program.blocks
                  .sort((a, b) => a.order_num - b.order_num)
                  .map((block, bi) => {
                    const weekCount = Array.isArray(block.weeks)
                      ? block.weeks.length
                      : block.weekCount ?? 1;
                    return (
                      <div key={block.id}>
                        {bi > 0 && config.pageBreaks === "between-blocks" && (
                          <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: theme.mutedText }}>Page break</span>
                            <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                          </div>
                        )}
                        {/* Block header */}
                        <div className="overflow-hidden mb-4 rounded-md">
                          <div
                            className="px-4 py-3 flex items-center justify-between"
                            style={{
                              backgroundColor: theme.blockHeaderBg,
                              color: theme.blockHeaderText,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="text-[11px] font-bold tracking-widest uppercase"
                                style={{ opacity: 0.5 }}
                              >
                                Block {bi + 1}
                              </span>
                              <span className="text-sm font-semibold tracking-wide uppercase">
                                {block.name}
                              </span>
                            </div>
                            <span
                              className="text-xs font-medium"
                              style={{ color: theme.mutedText }}
                            >
                              {weekCount}{" "}
                              {weekCount === 1 ? "week" : "weeks"}
                            </span>
                          </div>
                          {block.description && (
                            <div
                              className="px-4 py-2 text-xs"
                              style={{
                                backgroundColor: `${theme.blockHeaderBg}e6`,
                                color: theme.mutedText,
                              }}
                            >
                              {block.description}
                            </div>
                          )}
                        </div>

                        {/* Weeks */}
                        <div className="space-y-4">
                          {Array.isArray(block.weeks) &&
                          block.weeks.length > 0
                            ? block.weeks
                                .sort(
                                  (a, b) => a.weekNumber - b.weekNumber
                                )
                                .map((week) => (
                                  <div key={week.id}>
                                    <div className="flex items-center gap-3 mb-3 mt-2">
                                      <span
                                        className="text-[11px] font-bold tracking-widest uppercase"
                                        style={{ color: theme.mutedText }}
                                      >
                                        Week {week.weekNumber}
                                        {week.label
                                          ? ` — ${week.label}`
                                          : ""}
                                      </span>
                                      <div
                                        className="flex-1 h-px"
                                        style={{
                                          backgroundColor:
                                            theme.borderColor,
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-4">
                                      {week.days
                                        .sort(
                                          (a, b) =>
                                            a.order_num - b.order_num
                                        )
                                        .map((day, di) => (
                                          <div key={day.id}>
                                            {di > 0 && config.pageBreaks === "between-days" && (
                                              <div className="flex items-center gap-3 my-4">
                                                <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                                                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: theme.mutedText }}>Page break</span>
                                                <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                                              </div>
                                            )}
                                            <WorkoutDayTable
                                              day={day}
                                              theme={theme}
                                              config={config}
                                            />
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))
                            : block.days
                                .sort(
                                  (a, b) => a.order_num - b.order_num
                                )
                                .map((day, di) => (
                                  <div key={day.id}>
                                    {di > 0 && config.pageBreaks === "between-days" && (
                                      <div className="flex items-center gap-3 my-4">
                                        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: theme.mutedText }}>Page break</span>
                                        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                                      </div>
                                    )}
                                    <WorkoutDayTable
                                      day={day}
                                      theme={theme}
                                      config={config}
                                    />
                                  </div>
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
                    .map((day, di) => (
                      <div key={day.id}>
                        {di > 0 && config.pageBreaks === "between-days" && (
                          <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: theme.mutedText }}>Page break</span>
                            <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: theme.borderColor }} />
                          </div>
                        )}
                        <WorkoutDayTable
                          day={day}
                          theme={theme}
                          config={config}
                        />
                      </div>
                    ))}
                </div>
              )
            )}

            {/* Footer */}
            {config.footerText && (
              <div
                className="mt-8 pt-4 text-center text-xs"
                style={{ borderTopWidth: 1, borderColor: theme.borderColor, color: theme.mutedText }}
              >
                {config.footerText}
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
