import {
  IntensitySystem,
  Program,
  ProgramDay,
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
  500: "#6B7280",
  600: "#4B5563",
  800: "#1F2937",
};

const GOAL_COLORS: Record<string, { bg: string; text: string }> = {
  strength: { bg: "#FEE2E2", text: "#991B1B" },
  hypertrophy: { bg: "#DBEAFE", text: "#1E40AF" },
  endurance: { bg: "#DCFCE7", text: "#166534" },
  power: { bg: "#F3E8FF", text: "#6B21A8" },
};

const s = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: GRAY[800],
  },
  title: { fontSize: 20, fontWeight: "bold", letterSpacing: -0.5 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  goalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  modeText: { fontSize: 9, color: GRAY[500] },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: GRAY[200],
    marginVertical: 10,
  },
  description: { fontSize: 9, color: GRAY[600], marginBottom: 6 },

  // blocks
  blockBadge: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#92400E",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  weeksBadge: {
    fontSize: 8,
    color: GRAY[600],
    borderWidth: 1,
    borderColor: GRAY[300],
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },

  // day
  daySection: { marginBottom: 14 },
  dayTitle: { fontSize: 13, fontWeight: "bold", marginBottom: 2 },
  dayDesc: { fontSize: 8, color: GRAY[500], marginBottom: 6 },

  // table
  table: { borderWidth: 1, borderColor: GRAY[300], borderRadius: 4 },
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

// Column widths as percentages (Exercise | Set | Type | Reps | Intensity | Notes)
const COL = [28, 8, 18, 8, 14, 24];

/* ------------------------------------------------------------------
   Table sub-components
   ------------------------------------------------------------------ */

function TableHeader() {
  const labels = ["Exercise", "Set", "Type", "Reps", "Intensity", "Notes"];
  const centered = new Set([1, 3, 4]);
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

            {/* Reps */}
            <Text style={[s.cellCenter, { width: `${COL[3]}%` }]}>
              {g.set.reps}
            </Text>

            {/* Intensity */}
            <Text style={[s.cellCenter, { width: `${COL[4]}%` }]}>
              {formatIntensity(g.set, exercise.intensity) || "—"}
            </Text>

            {/* Notes — only on first set group row */}
            <Text style={[s.cellNotes, { width: `${COL[5]}%` }]}>
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
   Main PDF Document
   ------------------------------------------------------------------ */

export function ProgramPDF({ program }: { program: Program }) {
  const gc = GOAL_COLORS[program.goal] ?? GOAL_COLORS.strength;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.title}>{program.name}</Text>

        <View style={s.headerRow}>
          <Text style={[s.goalBadge, { backgroundColor: gc.bg, color: gc.text }]}>
            {program.goal}
          </Text>
          <Text style={s.modeText}>
            {program.mode === "blocks"
              ? "Block-based program"
              : "Day-based program"}
          </Text>
        </View>

        <View style={s.separator} />

        {program.description ? (
          <Text style={s.description}>{stripHtml(program.description)}</Text>
        ) : null}

        {/* Body */}
        {program.mode === "blocks" && program.blocks
          ? program.blocks
              .sort((a, b) => a.order_num - b.order_num)
              .map((block) => (
                <View key={block.id} style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Text style={s.blockBadge}>{block.name}</Text>
                    {block.weeks ? (
                      <Text style={s.weeksBadge}>
                        {block.weeks} {block.weeks === 1 ? "week" : "weeks"}
                      </Text>
                    ) : null}
                  </View>
                  <View style={s.separator} />
                  {block.days
                    .sort((a, b) => a.order_num - b.order_num)
                    .map((day) => (
                      <DayTable key={day.id} day={day} />
                    ))}
                </View>
              ))
          : program.days
            ? program.days
                .sort((a, b) => a.order_num - b.order_num)
                .map((day) => (
                  <View key={day.id}>
                    <DayTable day={day} />
                    <View style={s.separator} />
                  </View>
                ))
            : null}
      </Page>
    </Document>
  );
}
