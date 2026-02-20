import {
  IntensitySystem,
  Program,
  ProgramDay,
  ProgramWeek,
  RepSchemeType,
  SetInfo,
  WorkoutExerciseGroup,
} from "@/types/Workout";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

/* ------------------------------------------------------------------
   Formatting helpers — mirrors ProgramPreview logic exactly
   ------------------------------------------------------------------ */

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
      return `${base} (${set.drop_percent ?? "?"}% x ${set.drop_sets ?? "?"} sets)`;
    case "cluster":
      return `${base} (${set.cluster_reps ?? "?"} reps, ${set.intra_rest ?? "?"}s rest)`;
    case "myo_reps":
      return `${base} (Start: ${set.activation_set_reps ?? "?"}, Mini: ${set.mini_sets ?? "?"})`;
    case "rest_pause":
      return `${base} (${set.initial_reps ?? "?"} reps, ${set.pause_duration ?? "?"}s pause)`;
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/* ------------------------------------------------------------------
   Set grouping — identical to ProgramPreview
   ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------
   Styles
   ------------------------------------------------------------------ */

const GRAY = {
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  800: "#1F2937",
  900: "#111827",
};

/** Solid dark colours that approximate each goal's gradient for the PDF hero. */
const GOAL_HERO: Record<string, { bg: string; accent: string }> = {
  strength: { bg: "#2e1065", accent: "#a78bfa" },
  hypertrophy: { bg: "#052e16", accent: "#4ade80" },
  endurance: { bg: "#0c1a3a", accent: "#60a5fa" },
  power: { bg: "#451a03", accent: "#f59e0b" },
};

const s = StyleSheet.create({
  page: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: GRAY[800],
  },

  /* ── Hero header ── */
  hero: {
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 20,
  },
  heroModeLabel: {
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    opacity: 0.5,
    color: "#FFFFFF",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: "#FFFFFF",
    marginTop: 3,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  heroMetaText: {
    fontSize: 8,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "bold",
  },
  heroGoalText: {
    fontSize: 8,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  /* ── Body content ── */
  body: {
    padding: 36,
    paddingTop: 14,
  },
  description: { fontSize: 9, color: GRAY[600], marginBottom: 10 },

  /* ── Block header (dark bar) ── */
  blockHeader: {
    backgroundColor: GRAY[900],
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blockHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  blockNumber: {
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
  },
  blockName: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  blockWeeks: {
    fontSize: 8,
    color: GRAY[400],
    fontWeight: "bold",
  },
  blockDesc: {
    backgroundColor: GRAY[800],
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: 8,
    color: GRAY[300],
  },

  /* ── Week separator ── */
  weekSep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 6,
  },
  weekLabel: {
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: GRAY[400],
  },
  weekLine: {
    flex: 1,
    borderBottomWidth: 0.75,
    borderBottomColor: GRAY[200],
  },

  // day
  daySection: { marginBottom: 14 },
  dayTitle: { fontSize: 13, fontWeight: "bold", marginBottom: 2 },
  dayDesc: { fontSize: 8, color: GRAY[500], marginBottom: 6 },

  // table
  table: { borderWidth: 1, borderColor: GRAY[300] },
  headerCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: GRAY[600],
    paddingVertical: 5,
    paddingHorizontal: 6,
    backgroundColor: GRAY[100],
  },
  cell: { paddingVertical: 4, paddingHorizontal: 6, fontSize: 9 },
  cellCenter: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 9,
    textAlign: "center",
  },
  cellNotes: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 8,
    color: GRAY[600],
    fontStyle: "italic",
  },

  // group header row
  groupRow: {
    flexDirection: "row",
    backgroundColor: GRAY[50],
    borderTopWidth: 1,
    borderTopColor: GRAY[300],
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  groupType: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  groupRest: { fontSize: 7, color: GRAY[500], marginLeft: 8 },
  groupNotes: { fontSize: 7, fontStyle: "italic", marginLeft: 8 },

  // data rows
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: GRAY[200],
  },
  rowAlt: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: GRAY[200],
    backgroundColor: GRAY[50],
  },
});

// Column widths as percentages (Exercise | Set | Type | Rx | Rest | Intensity | Notes)
const COL = [24, 7, 16, 10, 8, 12, 23];

/* ------------------------------------------------------------------
   Table sub-components
   ------------------------------------------------------------------ */

function TableHeader() {
  const labels = ["Exercise", "Set", "Type", "Rx", "Rest", "Intensity", "Notes"];
  const centered = new Set([1, 3, 4, 5]);
  return (
    <View style={{ flexDirection: "row" }}>
      {labels.map((label, i) => (
        <Text
          key={label}
          style={[
            s.headerCell,
            { width: `${COL[i]}%` },
            centered.has(i) ? { textAlign: "center" as const } : {},
          ]}
        >
          {label}
        </Text>
      ))}
    </View>
  );
}

function GroupHeaderRow({ group }: { group: WorkoutExerciseGroup }) {
  if (group.type === "standard" && !group.rest_after_group && !group.notes)
    return null;
  return (
    <View style={s.groupRow}>
      {group.type !== "standard" && (
        <Text style={s.groupType}>{group.type.replace("_", " ")}</Text>
      )}
      {group.rest_after_group ? (
        <Text style={s.groupRest}>
          Rest after group: {formatRestTime(group.rest_after_group)}
        </Text>
      ) : null}
      {group.notes ? <Text style={s.groupNotes}>{group.notes}</Text> : null}
    </View>
  );
}

function ExerciseRows({
  group,
}: {
  group: WorkoutExerciseGroup;
}) {
  return (
    <>
      {group.exercises.map((exercise) => {
        const setGroups = groupConsecutiveSets(exercise.sets, exercise.intensity);
        return setGroups.map((g, gi) => (
          <View
            key={`${exercise.id}-${g.startIndex}`}
            style={gi % 2 ? s.rowAlt : s.row}
          >
            {/* Exercise name — only on first set group row */}
            <Text
              style={[
                s.cell,
                { width: `${COL[0]}%`, fontWeight: gi === 0 ? "bold" : undefined },
              ]}
            >
              {gi === 0 ? exercise.display_name : ""}
            </Text>

            {/* Set */}
            <Text style={[s.cellCenter, { width: `${COL[1]}%` }]}>
              {g.count > 1 ? `×${g.count}` : `${g.startIndex + 1}`}
            </Text>

            {/* Type */}
            <Text style={[s.cell, { width: `${COL[2]}%` }]}>
              {formatAdvancedSetInfo(g.set)}
            </Text>

            {/* Reps / Prescription */}
            <Text style={[s.cellCenter, { width: `${COL[3]}%` }]}>
              {formatPrescription(g.set, exercise.rep_scheme)}
            </Text>

            {/* Rest */}
            <Text style={[s.cellCenter, { width: `${COL[4]}%` }]}>
              {g.set.rest ? formatRestTime(g.set.rest) : "—"}
            </Text>

            {/* Intensity */}
            <Text style={[s.cellCenter, { width: `${COL[5]}%` }]}>
              {formatIntensity(g.set, exercise.intensity) || "—"}
            </Text>

            {/* Notes — only on first set group row */}
            <Text style={[s.cellNotes, { width: `${COL[6]}%` }]}>
              {gi === 0 ? exercise.notes || "—" : ""}
            </Text>
          </View>
        ));
      })}
    </>
  );
}

function DayTable({ day }: { day: ProgramDay }) {
  if (day.type !== "workout") return null;
  return (
    <View style={s.daySection} wrap={false}>
      <Text style={s.dayTitle}>
        Day {day.order_num + 1}: {day.name}
      </Text>
      {day.description ? (
        <Text style={s.dayDesc}>{stripHtml(day.description)}</Text>
      ) : null}

      <View style={s.table}>
        <TableHeader />
        {day.groups.map((group) => (
          <View key={group.id}>
            <GroupHeaderRow group={group} />
            <ExerciseRows group={group} />
          </View>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------
   Week helper
   ------------------------------------------------------------------ */

function WeekSection({ week }: { week: ProgramWeek }) {
  return (
    <View>
      <View style={s.weekSep}>
        <Text style={s.weekLabel}>
          Week {week.weekNumber}
          {week.label ? ` — ${week.label}` : ""}
        </Text>
        <View style={s.weekLine} />
      </View>
      {week.days
        .sort((a, b) => a.order_num - b.order_num)
        .map((day) => (
          <DayTable key={day.id} day={day} />
        ))}
    </View>
  );
}

/* ------------------------------------------------------------------
   Main PDF Document
   ------------------------------------------------------------------ */

export function ProgramPDF({ program }: { program: Program }) {
  const hero = GOAL_HERO[program.goal] ?? GOAL_HERO.strength;

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
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Hero header ── */}
        <View style={[s.hero, { backgroundColor: hero.bg }]}>
          <Text style={s.heroModeLabel}>
            {program.mode === "blocks"
              ? "Block-based program"
              : "Day-based program"}
          </Text>
          <Text style={s.heroTitle}>{program.name}</Text>
          <View style={s.heroMeta}>
            <Text style={[s.heroGoalText, { color: hero.accent }]}>
              {program.goal}
            </Text>
            {totalWeeks ? (
              <Text style={s.heroMetaText}>{totalWeeks} weeks</Text>
            ) : null}
            <Text style={s.heroMetaText}>
              {totalDays} training days
              {program.mode === "blocks" ? " / block" : ""}
            </Text>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>
          {program.description ? (
            <Text style={s.description}>{stripHtml(program.description)}</Text>
          ) : null}

          {/* Block mode */}
          {program.mode === "blocks" && program.blocks
            ? program.blocks
                .sort((a, b) => a.order_num - b.order_num)
                .map((block, bi) => {
                  const weekCount = Array.isArray(block.weeks)
                    ? block.weeks.length
                    : block.weekCount ?? 1;
                  return (
                    <View key={block.id} style={{ marginBottom: 16 }}>
                      {/* Block dark header */}
                      <View style={s.blockHeader}>
                        <View style={s.blockHeaderLeft}>
                          <Text style={s.blockNumber}>Block {bi + 1}</Text>
                          <Text style={s.blockName}>{block.name}</Text>
                        </View>
                        <Text style={s.blockWeeks}>
                          {weekCount} {weekCount === 1 ? "week" : "weeks"}
                        </Text>
                      </View>
                      {block.description ? (
                        <Text style={s.blockDesc}>{block.description}</Text>
                      ) : null}

                      {/* Weeks with separators, or fallback to flat days */}
                      {Array.isArray(block.weeks) && block.weeks.length > 0
                        ? block.weeks
                            .sort(
                              (a, b) =>
                                (a.weekNumber ?? 0) - (b.weekNumber ?? 0)
                            )
                            .map((week) => (
                              <WeekSection key={week.id} week={week} />
                            ))
                        : (block.days ?? [])
                            .sort((a, b) => a.order_num - b.order_num)
                            .map((day) => (
                              <DayTable key={day.id} day={day} />
                            ))}
                    </View>
                  );
                })
            : /* Day mode */
              program.days
              ? program.days
                  .sort((a, b) => a.order_num - b.order_num)
                  .map((day) => <DayTable key={day.id} day={day} />)
              : null}
        </View>
      </Page>
    </Document>
  );
}
