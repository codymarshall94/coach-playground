// ---------------------------------------------------------------------------
// PDF Layout Configuration — drives both the in-app preview and the exported PDF
// ---------------------------------------------------------------------------

export type PDFThemeId = "clean" | "bold" | "minimal" | "dark" | "sport";

export interface PDFTheme {
  id: PDFThemeId;
  label: string;
  description: string;
  /** Hero background color (solid for PDF, gradient CSS for preview) */
  heroBg: string;
  /** Hero preview gradient (CSS) */
  heroGradient: string;
  /** Hero text color */
  heroText: string;
  /** Hero accent text (goal badge, meta) */
  heroAccent: string;
  /** Table header background */
  tableHeaderBg: string;
  /** Table header text */
  tableHeaderText: string;
  /** Table alternate row background */
  tableAltRowBg: string;
  /** Block header background */
  blockHeaderBg: string;
  /** Block header text */
  blockHeaderText: string;
  /** Body background */
  bodyBg: string;
  /** Body text */
  bodyText: string;
  /** Muted text (descriptions, secondary info) */
  mutedText: string;
  /** Border/divider color */
  borderColor: string;
}

export interface PDFBranding {
  /** Coach/business name shown in header */
  coachName: string;
  /** Optional tagline under the coach name */
  tagline: string;
  /** Optional logo URL (data:uri or https) */
  logoUrl: string;
}

export type PDFFontSize = "small" | "medium" | "large";
export type PDFTableDensity = "compact" | "normal" | "spacious";
export type PDFPageBreak = "none" | "between-days" | "between-blocks";

export interface PDFLayoutConfig {
  // ── Theme ──
  themeId: PDFThemeId;
  /** Optional custom accent color override (hex). Overrides the theme hero colors. */
  accentColor: string;

  // ── Branding ──
  branding: PDFBranding;

  // ── Typography & Density ──
  /** Controls body & table text size */
  fontSize: PDFFontSize;
  /** Controls row padding in tables */
  tableDensity: PDFTableDensity;

  // ── Footer ──
  /** Custom text printed at the bottom of every page */
  footerText: string;

  // ── Page breaks ──
  pageBreaks: PDFPageBreak;

  // ── Section visibility toggles ──
  showDescription: boolean;
  showSetType: boolean;
  showRest: boolean;
  showIntensity: boolean;
  showNotes: boolean;
  /** Show warm-up sets or filter them out */
  showWarmupSets: boolean;

  // ── Cover options ──
  /** Show a dedicated cover page area at top */
  showCoverPage: boolean;
}

// ---------------------------------------------------------------------------
// Default config
// ---------------------------------------------------------------------------

export const DEFAULT_PDF_LAYOUT: PDFLayoutConfig = {
  themeId: "clean",
  accentColor: "",
  branding: { coachName: "", tagline: "", logoUrl: "" },
  fontSize: "medium",
  tableDensity: "normal",
  footerText: "",
  pageBreaks: "none",
  showDescription: true,
  showSetType: true,
  showRest: true,
  showIntensity: true,
  showNotes: true,
  showWarmupSets: true,
  showCoverPage: true,
};

// ---------------------------------------------------------------------------
// Built-in themes
// ---------------------------------------------------------------------------

export const PDF_THEMES: Record<PDFThemeId, PDFTheme> = {
  clean: {
    id: "clean",
    label: "Clean",
    description: "Light, professional, easy to read",
    heroBg: "#1e1b4b",
    heroGradient: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)",
    heroText: "#ffffff",
    heroAccent: "rgba(255,255,255,0.7)",
    tableHeaderBg: "#F3F4F6",
    tableHeaderText: "#4B5563",
    tableAltRowBg: "#F9FAFB",
    blockHeaderBg: "#111827",
    blockHeaderText: "#ffffff",
    bodyBg: "#ffffff",
    bodyText: "#1F2937",
    mutedText: "#6B7280",
    borderColor: "#D1D5DB",
  },
  bold: {
    id: "bold",
    label: "Bold",
    description: "High-contrast, impactful headers",
    heroBg: "#000000",
    heroGradient: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
    heroText: "#ffffff",
    heroAccent: "#e2e8f0",
    tableHeaderBg: "#1a1a2e",
    tableHeaderText: "#e2e8f0",
    tableAltRowBg: "#f1f5f9",
    blockHeaderBg: "#000000",
    blockHeaderText: "#ffffff",
    bodyBg: "#ffffff",
    bodyText: "#0f172a",
    mutedText: "#475569",
    borderColor: "#cbd5e1",
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description: "Stripped back, content-first",
    heroBg: "#f8fafc",
    heroGradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    heroText: "#0f172a",
    heroAccent: "#475569",
    tableHeaderBg: "#f8fafc",
    tableHeaderText: "#64748b",
    tableAltRowBg: "#fafafa",
    blockHeaderBg: "#f1f5f9",
    blockHeaderText: "#0f172a",
    bodyBg: "#ffffff",
    bodyText: "#334155",
    mutedText: "#94a3b8",
    borderColor: "#e2e8f0",
  },
  dark: {
    id: "dark",
    label: "Dark",
    description: "Dark mode for digital viewing",
    heroBg: "#0f0f0f",
    heroGradient: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #262626 100%)",
    heroText: "#fafafa",
    heroAccent: "#a1a1aa",
    tableHeaderBg: "#262626",
    tableHeaderText: "#a1a1aa",
    tableAltRowBg: "#1a1a1a",
    blockHeaderBg: "#0f0f0f",
    blockHeaderText: "#fafafa",
    bodyBg: "#171717",
    bodyText: "#e5e5e5",
    mutedText: "#737373",
    borderColor: "#404040",
  },
  sport: {
    id: "sport",
    label: "Sport",
    description: "Energetic, gym-ready feel",
    heroBg: "#1c1917",
    heroGradient: "linear-gradient(135deg, #1c1917 0%, #422006 50%, #ea580c 100%)",
    heroText: "#ffffff",
    heroAccent: "#fed7aa",
    tableHeaderBg: "#292524",
    tableHeaderText: "#fbbf24",
    tableAltRowBg: "#fefce8",
    blockHeaderBg: "#1c1917",
    blockHeaderText: "#fbbf24",
    bodyBg: "#fffbeb",
    bodyText: "#1c1917",
    mutedText: "#78716c",
    borderColor: "#d6d3d1",
  },
};
