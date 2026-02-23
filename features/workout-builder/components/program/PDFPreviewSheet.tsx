"use client";

import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Program,
  ProgramDay,
} from "@/types/Workout";
import {
  PDFLayoutConfig,
  PDFTheme,
} from "@/types/PDFLayout";
import {
  resolveTheme,
  buildVisibleColumns,
  groupConsecutiveSets,
  formatRestTime,
  formatIntensity,
  formatAdvancedSetInfo,
  formatPrescription,
  FONT_SIZE_MAP,
  DENSITY_MAP,
  ColumnDef,
} from "@/utils/pdfHelpers";
import DOMPurify from "dompurify";
import { Activity, Dumbbell, Target, Zap } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Goal icon mapping (Lucide — only used in the in-browser preview)
// ─────────────────────────────────────────────────────────────────────────────

const goalIcons = {
  strength: Zap,
  hypertrophy: Dumbbell,
  endurance: Activity,
  power: Target,
};

// ─────────────────────────────────────────────────────────────────────────────
// Theme-driven sub-components
// ─────────────────────────────────────────────────────────────────────────────

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
  const cols = buildVisibleColumns(config);
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
  zoom = 75,
}: {
  program: Program;
  config: PDFLayoutConfig;
  zoom?: number;
}) {
  const theme = resolveTheme(config);
  const GoalIcon = goalIcons[program.goal];
  const fonts = FONT_SIZE_MAP[config.fontSize];
  const fontFamily = config.fontFamily || "Inter";

  // Dynamically load the Google Font stylesheet
  useEffect(() => {
    const id = `pdf-font-${fontFamily.replace(/\s/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [fontFamily]);

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
      <div
        className="mx-auto max-w-[816px] shadow-xl border border-border/50 rounded-lg overflow-hidden my-6"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top center",
          marginBottom: `${Math.max(24, 24 - (816 * (1 - zoom / 100)))}px`,
        }}
      >
        <div style={{ backgroundColor: theme.bodyBg, fontFamily: `'${config.fontFamily || "Inter"}', 'Helvetica Neue', Helvetica, Arial, sans-serif` }} className="text-[13px] leading-6">
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
                  <div className="mb-4 flex items-center gap-3">
                    {config.branding.logoUrl && (
                      <img
                        src={config.branding.logoUrl}
                        alt=""
                        className="h-8 w-auto object-contain rounded"
                      />
                    )}
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

                {/* Prepared for */}
                {config.preparedFor && (
                  <div
                    className="mt-4 pt-3"
                    style={{ borderTop: `1px solid ${theme.heroText}20` }}
                  >
                    <span
                      className="text-[11px] font-medium uppercase tracking-wider"
                      style={{ color: `${theme.heroText}50` }}
                    >
                      Prepared for
                    </span>
                    <div
                      className="text-base font-semibold mt-0.5"
                      style={{ color: theme.heroText }}
                    >
                      {config.preparedFor}
                    </div>
                  </div>
                )}
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

            {/* Page number preview indicator */}
            {config.showPageNumbers && (
              <div
                className="mt-6 text-center text-[9px]"
                style={{ color: theme.mutedText }}
              >
                1 / 1 <span className="ml-1 opacity-50">(page numbers appear in exported PDF)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
