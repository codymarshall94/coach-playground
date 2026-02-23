// ---------------------------------------------------------------------------
// Shared PDF formatting helpers
// Used by both the in-browser preview (PDFPreviewSheet) and the printable
// HTML page (PDFPrintPage) that Puppeteer converts to a PDF.
// ---------------------------------------------------------------------------

import {
  IntensitySystem,
  RepSchemeType,
  SetInfo,
} from "@/types/Workout";
import {
  PDFLayoutConfig,
  PDFTheme,
  PDF_THEMES,
} from "@/types/PDFLayout";

// ── Set type labels ─────────────────────────────────────────────────────────

export const SET_TYPE_LABELS: Record<string, string> = {
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

// ── Formatting helpers ──────────────────────────────────────────────────────

export function formatRestTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

export function formatIntensity(
  set: SetInfo,
  system: IntensitySystem
): string {
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

export function formatAdvancedSetInfo(set: SetInfo): string {
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

export function formatPrescription(
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

// ── Set grouping ────────────────────────────────────────────────────────────

export interface SetGroup {
  startIndex: number;
  count: number;
  set: SetInfo;
}

export function setGroupingSignature(
  set: SetInfo,
  system: IntensitySystem
): string {
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

export function groupConsecutiveSets(
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

// ── Theme resolution ────────────────────────────────────────────────────────

export function resolveTheme(config: PDFLayoutConfig): PDFTheme {
  const base = PDF_THEMES[config.themeId];
  if (!config.accentColor) return base;
  return {
    ...base,
    heroBg: config.accentColor,
    heroGradient: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}dd 100%)`,
  };
}

// ── Font size / density maps (Tailwind class names for in-browser) ──────────

export const FONT_SIZE_MAP = {
  small: {
    body: "text-xs",
    table: "text-xs",
    heading: "text-base",
    hero: "text-2xl",
  },
  medium: {
    body: "text-sm",
    table: "text-sm",
    heading: "text-lg",
    hero: "text-3xl",
  },
  large: {
    body: "text-base",
    table: "text-base",
    heading: "text-xl",
    hero: "text-4xl",
  },
} as const;

export const DENSITY_MAP = {
  compact: { cellPy: "py-1", cellPx: "px-2", sectionGap: "mb-4" },
  normal: { cellPy: "py-2", cellPx: "px-3", sectionGap: "mb-8" },
  spacious: { cellPy: "py-3", cellPx: "px-4", sectionGap: "mb-12" },
} as const;

// ── Font / density maps (CSS values for printable HTML) ─────────────────────

export const FONT_SIZE_CSS = {
  small: { body: "12px", table: "12px", heading: "16px", hero: "24px", headerCell: "10px" },
  medium: { body: "14px", table: "14px", heading: "18px", hero: "30px", headerCell: "11px" },
  large: { body: "16px", table: "16px", heading: "20px", hero: "36px", headerCell: "12px" },
} as const;

export const DENSITY_CSS = {
  compact: { cellPadV: "4px", cellPadH: "8px", sectionGap: "16px" },
  normal: { cellPadV: "8px", cellPadH: "12px", sectionGap: "32px" },
  spacious: { cellPadV: "12px", cellPadH: "16px", sectionGap: "48px" },
} as const;

// ── Column definition helper ────────────────────────────────────────────────

export interface ColumnDef {
  key: string;
  header: string;
  center?: boolean;
  /** Width as a percentage (the exercise column gets the remainder). */
  width?: number;
}

export function buildVisibleColumns(config: PDFLayoutConfig): ColumnDef[] {
  const cols: ColumnDef[] = [
    { key: "exercise", header: "Exercise" },
    { key: "set", header: "Set", center: true, width: 7 },
  ];
  if (config.showSetType)
    cols.push({ key: "type", header: "Type", width: 16 });
  cols.push({ key: "rx", header: "Rx", center: true, width: 10 });
  if (config.showRest)
    cols.push({ key: "rest", header: "Rest", center: true, width: 8 });
  if (config.showIntensity)
    cols.push({
      key: "intensity",
      header: "Intensity",
      center: true,
      width: 12,
    });
  if (config.showNotes) cols.push({ key: "notes", header: "Notes", width: 23 });

  // Exercise column gets the remaining width
  const fixedWidth = cols.reduce((sum, c) => sum + (c.width ?? 0), 0);
  cols[0].width = 100 - fixedWidth;

  return cols;
}
