import {
  IntensitySystem,
  Program,
  ProgramDay,
  ProgramWeek,
  RepSchemeType,
  SetInfo,
  WorkoutExerciseGroup,
} from "@/types/Workout";
import {
  DEFAULT_PDF_LAYOUT,
  PDFLayoutConfig,
  PDFTheme,
  PDF_THEMES,
} from "@/types/PDFLayout";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Svg,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Rect,
} from "@react-pdf/renderer";

/* ------------------------------------------------------------------
   Formatting helpers
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
  const label = SET_TYPE_LABELS[set.set_type] ?? set.set_type.replace("_", " ");
  switch (set.set_type) {
    case "drop":
      return `${label} (${set.drop_percent ?? "?"}% × ${set.drop_sets ?? "?"} drops)`;
    case "cluster":
      return `${label} (${set.cluster_reps ?? "?"} reps, ${set.intra_rest ?? "?"}s rest)`;
    case "myo_reps":
      return `${label} (Start: ${set.activation_set_reps ?? "?"}, Mini: ${set.mini_sets ?? "?"})`;
    case "rest_pause":
      return `${label} (${set.initial_reps ?? "?"} reps, ${set.pause_duration ?? "?"}s pause)`;
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
      return (set.duration ? formatRestTime(set.duration) : `${set.reps}`) + side;
    case "range":
      return (set.reps_max ? `${set.reps}–${set.reps_max}` : `${set.reps}`) + side;
    case "each_side":
      return `${set.reps} e/s`;
    case "amrap":
      return `AMRAP${side}`;
    case "distance":
      return (set.distance != null ? `${set.distance}m` : `${set.reps}`) + side;
    case "fixed":
    default:
      return `${set.reps}${side}`;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/* ------------------------------------------------------------------
   Gradient parsing — extract color stops from CSS linear-gradient()
   so we can reproduce the same gradient with an SVG <LinearGradient>.
   ------------------------------------------------------------------ */

interface GradientStop {
  offset: string;
  color: string;
}

function parseGradientStops(gradient: string): GradientStop[] {
  const match = gradient.match(/linear-gradient\([^,]+,\s*(.*)\)/);
  if (!match) return [{ offset: "0%", color: gradient }];
  return match[1].split(/,\s*/).map((s) => {
    const parts = s.trim().split(/\s+/);
    return { color: parts[0], offset: parts[1] ?? "0%" };
  });
}

/* ------------------------------------------------------------------
   Set grouping
   ------------------------------------------------------------------ */

interface SetGroup {
  startIndex: number;
  count: number;
  set: SetInfo;
}

function setGroupingSignature(set: SetInfo, system: IntensitySystem) {
  return [
    set.set_type, set.reps, set.reps_max, set.rep_scheme,
    set.duration, set.distance, set.per_side, set.rest,
    formatIntensity(set, system),
    set.drop_percent, set.drop_sets, set.cluster_reps, set.intra_rest,
    set.activation_set_reps, set.mini_sets, set.initial_reps, set.pause_duration,
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
    while (j < sets.length && setGroupingSignature(sets[j], system) === sig) j++;
    groups.push({ startIndex: i, count: j - i, set: sets[i] });
    i = j;
  }
  return groups;
}

/* ------------------------------------------------------------------
   Resolve theme from config
   Matches the preview logic: custom accent also overrides heroGradient.
   ------------------------------------------------------------------ */

function resolveTheme(config: PDFLayoutConfig): PDFTheme {
  const base = PDF_THEMES[config.themeId];
  if (!config.accentColor) return base;
  return {
    ...base,
    heroBg: config.accentColor,
    heroGradient: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}dd 100%)`,
  };
}

/* ------------------------------------------------------------------
   Dynamic column widths
   ------------------------------------------------------------------ */

interface ColDef {
  key: string;
  label: string;
  width: number;
  center?: boolean;
}

function buildColumns(config: PDFLayoutConfig): ColDef[] {
  const cols: ColDef[] = [
    { key: "exercise", label: "Exercise", width: 0 },
    { key: "set", label: "Set", width: 7, center: true },
  ];
  if (config.showSetType) cols.push({ key: "type", label: "Type", width: 16 });
  cols.push({ key: "rx", label: "Rx", width: 10, center: true });
  if (config.showRest) cols.push({ key: "rest", label: "Rest", width: 8, center: true });
  if (config.showIntensity) cols.push({ key: "intensity", label: "Intensity", width: 12, center: true });
  if (config.showNotes) cols.push({ key: "notes", label: "Notes", width: 23 });

  const fixedWidth = cols.reduce((sum, c) => sum + c.width, 0);
  cols[0].width = 100 - fixedWidth;

  return cols;
}

/* ------------------------------------------------------------------
   Font size & density maps
   Pixel-to-point conversion: 1pt ≈ 1.333px

   Preview Tailwind → PDF pt equivalents:
   text-xs  = 12px ≈ 9pt     text-sm  = 14px ≈ 10.5pt
   text-base= 16px ≈ 12pt    text-lg  = 18px ≈ 13.5pt
   text-xl  = 20px ≈ 15pt    text-2xl = 24px ≈ 18pt
   text-3xl = 30px ≈ 22.5pt  text-4xl = 36px ≈ 27pt
   ------------------------------------------------------------------ */

const FONT_SIZE_PT = {
  small:  { body: 9,    table: 9,    heading: 12,   hero: 18,   headerCell: 7 },
  medium: { body: 10.5, table: 10.5, heading: 13.5, hero: 22.5, headerCell: 8 },
  large:  { body: 12,   table: 12,   heading: 15,   hero: 27,   headerCell: 9 },
} as const;

const DENSITY_PT = {
  compact:  { cellPadV: 3, cellPadH: 6 },
  normal:   { cellPadV: 6, cellPadH: 9 },
  spacious: { cellPadV: 9, cellPadH: 12 },
} as const;

/* ------------------------------------------------------------------
   Base styles — theme-independent structure.
   Paddings are matched to the preview's Tailwind values:
     px-8 ≈ 32px ≈ 24pt   pt-10 ≈ 40px ≈ 30pt   pb-8 ≈ 32px ≈ 24pt
   ------------------------------------------------------------------ */

const A4_WIDTH_PT = 595;

const base = StyleSheet.create({
  page: { fontFamily: "Helvetica" },

  /* ── Hero ── */
  hero: {
    position: "relative",
    overflow: "hidden",
    paddingHorizontal: 32,
    paddingTop: 30,
    paddingBottom: 24,
  },
  heroGradientSvg: { position: "absolute", top: 0, left: 0 },
  heroContent: { position: "relative" },
  heroBranding: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  heroBrandName: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.4 },
  heroBrandTagline: { fontSize: 8, fontStyle: "italic", marginLeft: 10 },
  heroModeLabel: {
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  heroTitle: { fontWeight: "bold", letterSpacing: -0.5, marginTop: 3 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 8 },
  heroGoalText: { fontSize: 8, fontWeight: "bold", textTransform: "capitalize" },
  heroMetaText: { fontSize: 8, fontWeight: "bold" },

  /* ── Body ── */
  body: { paddingHorizontal: 32, paddingBottom: 32, paddingTop: 12 },
  description: { marginBottom: 16, lineHeight: 1.5 },

  /* ── Block header ── */
  blockWrapper: { marginBottom: 20 },
  blockHeaderOuter: { borderRadius: 6, overflow: "hidden", marginBottom: 12 },
  blockHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blockHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  blockNumber: {
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 1.0,
    textTransform: "uppercase",
    opacity: 0.5,
  },
  blockName: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  blockWeeks: { fontSize: 8, fontWeight: "bold" },
  blockDesc: { paddingHorizontal: 14, paddingVertical: 6, fontSize: 8 },

  /* ── Week separator ── */
  weekSep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  weekLabel: {
    fontSize: 7,
    fontWeight: "bold",
    letterSpacing: 1.0,
    textTransform: "uppercase",
  },
  weekLine: { flex: 1, height: 1 },

  /* ── Day ── */
  daySection: { marginBottom: 16 },
  dayTitle: { fontWeight: "bold", marginBottom: 3 },
  dayDesc: { fontSize: 8, marginBottom: 8 },

  /* ── Table ── */
  tableOuter: { borderRadius: 6, overflow: "hidden", borderWidth: 1 },
  headerCell: {
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cell: {},
  cellCenter: { textAlign: "center" },
  cellNotes: { fontStyle: "italic" },
  groupRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  groupType: { fontSize: 9, fontWeight: "bold", textTransform: "capitalize" },
  groupRest: { fontSize: 7, marginLeft: 12 },
  groupNotes: { fontSize: 7, fontStyle: "italic", marginLeft: 12 },
  row: { flexDirection: "row", borderTopWidth: 1 },

  /* ── Footer ── */
  footer: {
    textAlign: "center",
    paddingTop: 10,
    marginTop: 16,
    borderTopWidth: 1,
    marginHorizontal: 32,
    marginBottom: 20,
  },
});

/* ------------------------------------------------------------------
   SVG Hero gradient background
   ------------------------------------------------------------------ */

function HeroGradientBg({ gradient }: { gradient: string }) {
  const stops = parseGradientStops(gradient);
  return (
    <Svg style={base.heroGradientSvg} width={A4_WIDTH_PT} height={400}>
      <Defs>
        <SvgGradient
          id="heroGrad"
          x1="0"
          y1="0"
          x2={String(A4_WIDTH_PT)}
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          {stops.map((s, i) => (
            <Stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </SvgGradient>
      </Defs>
      <Rect x="0" y="0" width={String(A4_WIDTH_PT)} height="400" fill="url(#heroGrad)" />
    </Svg>
  );
}

/* ------------------------------------------------------------------
   Table sub-components
   ------------------------------------------------------------------ */

function TableHeader({
  cols,
  theme,
  config,
}: {
  cols: ColDef[];
  theme: PDFTheme;
  config: PDFLayoutConfig;
}) {
  const fs = FONT_SIZE_PT[config.fontSize];
  const den = DENSITY_PT[config.tableDensity];
  return (
    <View style={{ flexDirection: "row" }}>
      {cols.map((col) => (
        <Text
          key={col.key}
          style={[
            base.headerCell,
            {
              width: `${col.width}%`,
              backgroundColor: theme.tableHeaderBg,
              color: theme.tableHeaderText,
              fontSize: fs.headerCell,
              paddingVertical: den.cellPadV + 1,
              paddingHorizontal: den.cellPadH,
            },
            col.center ? { textAlign: "center" as const } : {},
          ]}
        >
          {col.label}
        </Text>
      ))}
    </View>
  );
}

function GroupHeaderRow({
  group,
  theme,
}: {
  group: WorkoutExerciseGroup;
  theme: PDFTheme;
}) {
  if (group.type === "standard" && !group.rest_after_group && !group.notes)
    return null;
  return (
    <View
      style={[
        base.groupRow,
        { backgroundColor: theme.tableAltRowBg, borderTopColor: theme.borderColor },
      ]}
    >
      {group.type !== "standard" && (
        <Text style={[base.groupType, { color: theme.bodyText }]}>
          {group.type.replace("_", " ")}
        </Text>
      )}
      {group.rest_after_group ? (
        <Text style={[base.groupRest, { color: theme.mutedText }]}>
          Rest after group: {formatRestTime(group.rest_after_group)}
        </Text>
      ) : null}
      {group.notes ? (
        <Text style={[base.groupNotes, { color: theme.mutedText }]}>{group.notes}</Text>
      ) : null}
    </View>
  );
}

function ExerciseRows({
  group,
  theme,
  cols,
  config,
}: {
  group: WorkoutExerciseGroup;
  theme: PDFTheme;
  cols: ColDef[];
  config: PDFLayoutConfig;
}) {
  const fs = FONT_SIZE_PT[config.fontSize];
  const den = DENSITY_PT[config.tableDensity];
  const cp = {
    paddingVertical: den.cellPadV,
    paddingHorizontal: den.cellPadH,
    fontSize: fs.table,
  };

  return (
    <>
      {group.exercises.map((exercise) => {
        let filteredSets = exercise.sets;
        if (!config.showWarmupSets) {
          filteredSets = filteredSets.filter((s) => s.set_type !== "warmup");
        }
        if (filteredSets.length === 0) return null;

        const setGroups = groupConsecutiveSets(filteredSets, exercise.intensity);
        return setGroups.map((g, gi) => {
          const noteParts: string[] = [];
          if (gi === 0 && exercise.notes) noteParts.push(exercise.notes);
          if (g.set.notes) noteParts.push(g.set.notes);

          const cellMap: Record<string, React.ReactNode> = {
            exercise: (
              <Text
                key="exercise"
                style={[
                  base.cell,
                  cp,
                  {
                    width: `${cols.find((c) => c.key === "exercise")!.width}%`,
                    fontWeight: gi === 0 ? "bold" : undefined,
                    color: theme.bodyText,
                  },
                ]}
              >
                {gi === 0 ? exercise.display_name : ""}
              </Text>
            ),
            set: (
              <Text
                key="set"
                style={[
                  base.cellCenter,
                  cp,
                  {
                    width: `${cols.find((c) => c.key === "set")!.width}%`,
                    color: theme.bodyText,
                  },
                ]}
              >
                {g.count > 1 ? `×${g.count}` : `${g.startIndex + 1}`}
              </Text>
            ),
            type: (
              <Text
                key="type"
                style={[
                  base.cell,
                  cp,
                  {
                    width: `${cols.find((c) => c.key === "type")!.width}%`,
                    color: theme.bodyText,
                  },
                ]}
              >
                {formatAdvancedSetInfo(g.set)}
              </Text>
            ),
            rx: (
              <Text
                key="rx"
                style={[
                  base.cellCenter,
                  cp,
                  {
                    width: `${cols.find((c) => c.key === "rx")!.width}%`,
                    color: theme.bodyText,
                  },
                ]}
              >
                {formatPrescription(g.set, exercise.rep_scheme)}
              </Text>
            ),
            rest: (
              <Text
                key="rest"
                style={[
                  base.cellCenter,
                  cp,
                  {
                    width: `${cols.find((c) => c.key === "rest")!.width}%`,
                    color: theme.mutedText,
                  },
                ]}
              >
                {g.set.rest ? formatRestTime(g.set.rest) : "—"}
              </Text>
            ),
            intensity: (
              <Text
                key="intensity"
                style={[
                  base.cellCenter,
                  cp,
                  {
                    width: `${cols.find((c) => c.key === "intensity")!.width}%`,
                    color: theme.bodyText,
                  },
                ]}
              >
                {formatIntensity(g.set, exercise.intensity) || "—"}
              </Text>
            ),
            notes: (
              <Text
                key="notes"
                style={[
                  base.cellNotes,
                  cp,
                  {
                    width: `${cols.find((c) => c.key === "notes")!.width}%`,
                    color: theme.mutedText,
                  },
                ]}
              >
                {noteParts.length > 0 ? noteParts.join(" · ") : gi === 0 ? "—" : ""}
              </Text>
            ),
          };

          return (
            <View
              key={`${exercise.id}-${g.startIndex}`}
              style={[
                base.row,
                {
                  borderTopColor: theme.borderColor,
                  backgroundColor: gi % 2 ? theme.tableAltRowBg : theme.bodyBg,
                },
              ]}
            >
              {cols.map((col) => cellMap[col.key])}
            </View>
          );
        });
      })}
    </>
  );
}

function DayTable({
  day,
  theme,
  cols,
  config,
}: {
  day: ProgramDay;
  theme: PDFTheme;
  cols: ColDef[];
  config: PDFLayoutConfig;
}) {
  if (day.type !== "workout") return null;
  const fs = FONT_SIZE_PT[config.fontSize];
  return (
    <View style={base.daySection} wrap={false}>
      <Text style={[base.dayTitle, { color: theme.bodyText, fontSize: fs.heading }]}>
        Day {day.order_num + 1}: {day.name}
      </Text>
      {day.description && config.showDescription ? (
        <Text style={[base.dayDesc, { color: theme.mutedText }]}>
          {stripHtml(day.description)}
        </Text>
      ) : null}

      <View style={[base.tableOuter, { borderColor: theme.borderColor }]}>
        <TableHeader cols={cols} theme={theme} config={config} />
        {day.groups.map((group) => (
          <View key={group.id}>
            <GroupHeaderRow group={group} theme={theme} />
            <ExerciseRows group={group} theme={theme} cols={cols} config={config} />
          </View>
        ))}
      </View>
    </View>
  );
}

function WeekSection({
  week,
  theme,
  cols,
  config,
}: {
  week: ProgramWeek;
  theme: PDFTheme;
  cols: ColDef[];
  config: PDFLayoutConfig;
}) {
  return (
    <View>
      <View style={base.weekSep}>
        <Text style={[base.weekLabel, { color: theme.mutedText }]}>
          Week {week.weekNumber}
          {week.label ? ` — ${week.label}` : ""}
        </Text>
        <View style={[base.weekLine, { backgroundColor: theme.borderColor }]} />
      </View>
      {week.days
        .sort((a, b) => a.order_num - b.order_num)
        .map((day) => (
          <DayTable key={day.id} day={day} theme={theme} cols={cols} config={config} />
        ))}
    </View>
  );
}

/* ------------------------------------------------------------------
   Main PDF Document
   ------------------------------------------------------------------ */

export function ProgramPDF({
  program,
  config: configProp,
}: {
  program: Program;
  config?: PDFLayoutConfig;
}) {
  const config = configProp ?? DEFAULT_PDF_LAYOUT;
  const theme = resolveTheme(config);
  const cols = buildColumns(config);
  const fs = FONT_SIZE_PT[config.fontSize];

  const totalWeeks =
    program.mode === "blocks" && program.blocks
      ? program.blocks.reduce(
          (sum, b) =>
            sum + (Array.isArray(b.weeks) ? b.weeks.length : b.weekCount ?? 1),
          0
        )
      : null;
  const totalDays =
    program.mode === "blocks" && program.blocks
      ? program.blocks.reduce((sum, b) => sum + (b.days?.length ?? 0), 0)
      : program.days?.length ?? 0;

  /** Wrap content in pages, inserting page breaks as requested. */
  const wrapWithBreaks = (
    items: React.ReactNode[],
    breakType: "block" | "day"
  ) => {
    if (
      (breakType === "block" && config.pageBreaks !== "between-blocks") ||
      (breakType === "day" && config.pageBreaks !== "between-days")
    ) {
      return items;
    }
    return items.map((item, i) =>
      i === 0 ? (
        item
      ) : (
        <Page
          key={`page-${i}`}
          size="A4"
          style={[
            base.page,
            { color: theme.bodyText, backgroundColor: theme.bodyBg },
          ]}
        >
          <View style={base.body}>{item}</View>
          {config.footerText ? (
            <View
              style={[base.footer, { borderTopColor: theme.borderColor }]}
              fixed
            >
              <Text style={{ fontSize: fs.body - 1, color: theme.mutedText }}>
                {config.footerText}
              </Text>
            </View>
          ) : null}
        </Page>
      )
    );
  };

  /* ── Block content ── */
  const blockContent =
    program.mode === "blocks" && program.blocks
      ? program.blocks
          .sort((a, b) => a.order_num - b.order_num)
          .map((block, bi) => {
            const weekCount = Array.isArray(block.weeks)
              ? block.weeks.length
              : block.weekCount ?? 1;
            return (
              <View key={block.id} style={base.blockWrapper}>
                {/* Block header — rounded container */}
                <View style={base.blockHeaderOuter}>
                  <View
                    style={[
                      base.blockHeader,
                      { backgroundColor: theme.blockHeaderBg },
                    ]}
                  >
                    <View style={base.blockHeaderLeft}>
                      <Text
                        style={[
                          base.blockNumber,
                          { color: theme.blockHeaderText },
                        ]}
                      >
                        Block {bi + 1}
                      </Text>
                      <Text
                        style={[
                          base.blockName,
                          { color: theme.blockHeaderText },
                        ]}
                      >
                        {block.name}
                      </Text>
                    </View>
                    <Text style={[base.blockWeeks, { color: theme.mutedText }]}>
                      {weekCount} {weekCount === 1 ? "week" : "weeks"}
                    </Text>
                  </View>
                  {block.description ? (
                    <Text
                      style={[
                        base.blockDesc,
                        {
                          backgroundColor: `${theme.blockHeaderBg}e6`,
                          color: theme.mutedText,
                        },
                      ]}
                    >
                      {block.description}
                    </Text>
                  ) : null}
                </View>

                {Array.isArray(block.weeks) && block.weeks.length > 0
                  ? block.weeks
                      .sort(
                        (a, b) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0)
                      )
                      .map((week) => (
                        <WeekSection
                          key={week.id}
                          week={week}
                          theme={theme}
                          cols={cols}
                          config={config}
                        />
                      ))
                  : (block.days ?? [])
                      .sort((a, b) => a.order_num - b.order_num)
                      .map((day) => (
                        <DayTable
                          key={day.id}
                          day={day}
                          theme={theme}
                          cols={cols}
                          config={config}
                        />
                      ))}
              </View>
            );
          })
      : null;

  /* ── Day-only content ── */
  const dayContent =
    !blockContent && program.days
      ? program.days
          .sort((a, b) => a.order_num - b.order_num)
          .map((day) => (
            <DayTable
              key={day.id}
              day={day}
              theme={theme}
              cols={cols}
              config={config}
            />
          ))
      : null;

  return (
    <Document>
      <Page
        size="A4"
        style={[
          base.page,
          {
            color: theme.bodyText,
            backgroundColor: theme.bodyBg,
            fontSize: fs.body,
          },
        ]}
      >
        {/* ── Hero header with gradient ── */}
        {config.showCoverPage && (
          <View style={base.hero}>
            {/* SVG gradient background (matches preview heroGradient) */}
            <HeroGradientBg gradient={theme.heroGradient} />

            <View style={base.heroContent}>
              {/* Branding — inline row matching preview layout */}
              {config.branding.coachName ? (
                <View style={base.heroBranding}>
                  <Text
                    style={[
                      base.heroBrandName,
                      { color: theme.heroAccent },
                    ]}
                  >
                    {config.branding.coachName}
                  </Text>
                  {config.branding.tagline ? (
                    <Text
                      style={[
                        base.heroBrandTagline,
                        { color: `${theme.heroText}80` },
                      ]}
                    >
                      {config.branding.tagline}
                    </Text>
                  ) : null}
                </View>
              ) : null}

              <Text
                style={[
                  base.heroModeLabel,
                  { color: `${theme.heroText}50` },
                ]}
              >
                {program.mode === "blocks"
                  ? "Block-based program"
                  : "Day-based program"}
              </Text>

              <Text
                style={[
                  base.heroTitle,
                  { color: theme.heroText, fontSize: fs.hero },
                ]}
              >
                {program.name}
              </Text>

              <View style={base.heroMeta}>
                <Text
                  style={[base.heroGoalText, { color: theme.heroAccent }]}
                >
                  {program.goal}
                </Text>
                {totalWeeks ? (
                  <Text
                    style={[
                      base.heroMetaText,
                      { color: `${theme.heroText}50` },
                    ]}
                  >
                    {totalWeeks} weeks
                  </Text>
                ) : null}
                <Text
                  style={[
                    base.heroMetaText,
                    { color: `${theme.heroText}50` },
                  ]}
                >
                  {totalDays} training days
                  {program.mode === "blocks" ? " / block" : ""}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Body ── */}
        <View style={base.body}>
          {program.description && config.showDescription ? (
            <Text
              style={[
                base.description,
                { color: theme.mutedText, fontSize: fs.body },
              ]}
            >
              {stripHtml(program.description)}
            </Text>
          ) : null}

          {blockContent && wrapWithBreaks(blockContent, "block")}
          {dayContent && wrapWithBreaks(dayContent, "day")}
        </View>

        {/* ── Footer ── */}
        {config.footerText ? (
          <View
            style={[base.footer, { borderTopColor: theme.borderColor }]}
            fixed
          >
            <Text style={{ fontSize: fs.body - 1, color: theme.mutedText }}>
              {config.footerText}
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
