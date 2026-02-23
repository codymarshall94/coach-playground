// ---------------------------------------------------------------------------
// PDF HTML Builder — generates a complete HTML document string for Puppeteer.
//
// This is a pure function (no React, no JSX) that builds the same layout as
// PDFPreviewSheet but as a self-contained HTML string with inline styles.
// The API route feeds this to Puppeteer's page.setContent() → page.pdf().
// ---------------------------------------------------------------------------

import {
  Program,
  ProgramDay,
  ProgramBlock,
  ProgramWeek,
  WorkoutExerciseGroup,
} from "@/types/Workout";
import { PDFLayoutConfig, PDFTheme } from "@/types/PDFLayout";
import {
  resolveTheme,
  buildVisibleColumns,
  groupConsecutiveSets,
  formatRestTime,
  formatIntensity,
  formatAdvancedSetInfo,
  formatPrescription,
  FONT_SIZE_CSS,
  DENSITY_CSS,
  ColumnDef,
} from "@/utils/pdfHelpers";

// ---------------------------------------------------------------------------
// Goal SVG icons (inline)
// ---------------------------------------------------------------------------

const GOAL_ICONS: Record<string, string> = {
  strength: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  hypertrophy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`,
  endurance: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`,
  power: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
};

// ---------------------------------------------------------------------------
// Escaping helper
// ---------------------------------------------------------------------------

function esc(text: string | number | null | undefined): string {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Day table
// ---------------------------------------------------------------------------

function renderDayTable(
  day: ProgramDay,
  theme: PDFTheme,
  config: PDFLayoutConfig,
  cols: ColumnDef[]
): string {
  if (day.type !== "workout") return "";
  const fonts = FONT_SIZE_CSS[config.fontSize];
  const density = DENSITY_CSS[config.tableDensity];

  let html = `<div style="margin-bottom:${density.sectionGap};break-inside:avoid">`;

  // Day heading
  html += `<h2 style="font-size:${fonts.heading};font-weight:700;margin-bottom:4px;color:${theme.bodyText}">Day ${day.order_num + 1}: ${esc(day.name)}</h2>`;

  if (day.description && config.showDescription) {
    html += `<p style="font-size:12px;margin-bottom:12px;color:${theme.mutedText}">${esc(day.description)}</p>`;
  }

  // Table
  html += `<table style="width:100%;font-size:${fonts.table};border-collapse:collapse;border-radius:6px;overflow:hidden;border:1px solid ${theme.borderColor}">`;

  // Header
  html += `<thead><tr style="background:${theme.tableHeaderBg};color:${theme.tableHeaderText}">`;
  for (const col of cols) {
    html += `<th style="padding:${density.cellPadV} ${density.cellPadH};font-size:${fonts.headerCell};font-weight:600;letter-spacing:0.05em;text-transform:uppercase;text-align:${col.center ? "center" : "left"};${col.width ? `width:${col.width}%` : ""}">${esc(col.header)}</th>`;
  }
  html += `</tr></thead><tbody>`;

  // Group rows
  for (const group of day.groups) {
    html += renderGroupRows(group, theme, config, cols);
  }

  html += `</tbody></table></div>`;
  return html;
}

// ---------------------------------------------------------------------------
// Exercise group rows
// ---------------------------------------------------------------------------

function renderGroupRows(
  group: WorkoutExerciseGroup,
  theme: PDFTheme,
  config: PDFLayoutConfig,
  cols: ColumnDef[]
): string {
  const density = DENSITY_CSS[config.tableDensity];
  const fonts = FONT_SIZE_CSS[config.fontSize];
  let html = "";

  // Group header row
  const showGroupHeader =
    group.type !== "standard" || !!group.rest_after_group || !!group.notes;

  if (showGroupHeader) {
    html += `<tr style="border-top:1px solid ${theme.borderColor};background:${theme.tableAltRowBg}">`;
    html += `<td colspan="${cols.length}" style="padding:${density.cellPadV} ${density.cellPadH};font-weight:500;color:${theme.bodyText};font-size:${fonts.table}">`;
    if (group.type !== "standard") {
      html += `<span style="font-weight:600;text-transform:capitalize">${esc(group.type.replace("_", " "))}</span>`;
    }
    if (group.rest_after_group) {
      html += `<span style="margin-left:16px;font-size:12px;color:${theme.mutedText}">⏱ Rest after group: ${formatRestTime(group.rest_after_group)}</span>`;
    }
    if (group.notes) {
      html += `<span style="margin-left:16px;font-style:italic;font-size:12px;color:${theme.mutedText}">${esc(group.notes)}</span>`;
    }
    html += `</td></tr>`;
  }

  // Exercise rows
  for (const exercise of group.exercises) {
    let filteredSets = exercise.sets;
    if (!config.showWarmupSets) {
      filteredSets = filteredSets.filter((s) => s.set_type !== "warmup");
    }
    if (filteredSets.length === 0) continue;

    const setGroups = groupConsecutiveSets(filteredSets, exercise.intensity);

    for (let gi = 0; gi < setGroups.length; gi++) {
      const g = setGroups[gi];
      const noteParts: string[] = [];
      if (gi === 0 && exercise.notes) noteParts.push(exercise.notes);
      if (g.set.notes) noteParts.push(g.set.notes);

      const bg = gi % 2 ? theme.tableAltRowBg : theme.bodyBg;
      html += `<tr style="background:${bg};border-top:1px solid ${theme.borderColor}">`;

      for (const col of cols) {
        const pad = `padding:${density.cellPadV} ${density.cellPadH}`;
        const align = col.center ? "center" : "left";

        switch (col.key) {
          case "exercise":
            html += `<td style="${pad};font-size:${fonts.table};color:${theme.bodyText};text-align:left;vertical-align:top;${gi === 0 ? "font-weight:600" : ""};width:${col.width ?? 30}%">${gi === 0 ? esc(exercise.display_name) : ""}</td>`;
            break;
          case "set":
            html += `<td style="${pad};font-size:${fonts.table};color:${theme.bodyText};text-align:${align}">${g.count > 1 ? `×${g.count}` : `${g.startIndex + 1}`}</td>`;
            break;
          case "type":
            html += `<td style="${pad};font-size:${fonts.table};color:${theme.bodyText};text-align:${align};white-space:pre-line">${esc(formatAdvancedSetInfo(g.set))}</td>`;
            break;
          case "rx":
            html += `<td style="${pad};font-size:${fonts.table};color:${theme.bodyText};text-align:${align}">${esc(formatPrescription(g.set, exercise.rep_scheme))}</td>`;
            break;
          case "rest":
            html += `<td style="${pad};font-size:12px;color:${theme.mutedText};text-align:${align}">${g.set.rest ? formatRestTime(g.set.rest) : "—"}</td>`;
            break;
          case "intensity":
            html += `<td style="${pad};font-size:${fonts.table};color:${theme.bodyText};text-align:${align}">${esc(formatIntensity(g.set, exercise.intensity)) || "—"}</td>`;
            break;
          case "notes":
            html += `<td style="${pad};font-style:italic;font-size:12px;color:${theme.mutedText};text-align:left;vertical-align:top">${noteParts.length > 0 ? esc(noteParts.join(" · ")) : gi === 0 ? "—" : ""}</td>`;
            break;
        }
      }

      html += `</tr>`;
    }
  }

  return html;
}

// ---------------------------------------------------------------------------
// Week section
// ---------------------------------------------------------------------------

function renderWeekSection(
  week: ProgramWeek,
  theme: PDFTheme,
  config: PDFLayoutConfig,
  cols: ColumnDef[]
): string {
  let html = `<div style="margin-bottom:16px">`;

  // Week separator
  html += `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;margin-top:8px">`;
  html += `<span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${theme.mutedText};white-space:nowrap">Week ${week.weekNumber}${week.label ? ` — ${esc(week.label)}` : ""}</span>`;
  html += `<div style="flex:1;height:1px;background:${theme.borderColor}"></div></div>`;

  // Days
  const sortedDays = [...week.days].sort((a, b) => a.order_num - b.order_num);
  for (let di = 0; di < sortedDays.length; di++) {
    const day = sortedDays[di];
    if (di > 0 && config.pageBreaks === "between-days") {
      html += `<div style="break-before:page"></div>`;
    }
    html += renderDayTable(day, theme, config, cols);
  }

  html += `</div>`;
  return html;
}

// ---------------------------------------------------------------------------
// Block section
// ---------------------------------------------------------------------------

function renderBlock(
  block: ProgramBlock,
  bi: number,
  theme: PDFTheme,
  config: PDFLayoutConfig,
  cols: ColumnDef[]
): string {
  const weekCount = Array.isArray(block.weeks)
    ? block.weeks.length
    : block.weekCount ?? 1;

  let html = `<div style="margin-bottom:32px;${bi > 0 && config.pageBreaks === "between-blocks" ? "break-before:page" : ""}">`;

  // Block header
  html += `<div style="overflow:hidden;margin-bottom:16px;border-radius:6px">`;
  html += `<div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;background:${theme.blockHeaderBg};color:${theme.blockHeaderText}">`;
  html += `<div style="display:flex;align-items:center;gap:12px">`;
  html += `<span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.5">Block ${bi + 1}</span>`;
  html += `<span style="font-size:14px;font-weight:600;letter-spacing:0.03em;text-transform:uppercase">${esc(block.name)}</span>`;
  html += `</div>`;
  html += `<span style="font-size:12px;font-weight:500;color:${theme.mutedText}">${weekCount} ${weekCount === 1 ? "week" : "weeks"}</span>`;
  html += `</div>`;

  if (block.description) {
    html += `<div style="padding:8px 16px;font-size:12px;background:${theme.blockHeaderBg}e6;color:${theme.mutedText}">${esc(block.description)}</div>`;
  }
  html += `</div>`;

  // Weeks or days
  if (Array.isArray(block.weeks) && block.weeks.length > 0) {
    const sortedWeeks = [...block.weeks].sort(
      (a, b) => a.weekNumber - b.weekNumber
    );
    for (const week of sortedWeeks) {
      html += renderWeekSection(week, theme, config, cols);
    }
  } else {
    const sortedDays = [...(block.days ?? [])].sort(
      (a, b) => a.order_num - b.order_num
    );
    for (let di = 0; di < sortedDays.length; di++) {
      if (di > 0 && config.pageBreaks === "between-days") {
        html += `<div style="break-before:page"></div>`;
      }
      html += renderDayTable(sortedDays[di], theme, config, cols);
    }
  }

  html += `</div>`;
  return html;
}

// ---------------------------------------------------------------------------
// Main export — builds the full HTML document string
// ---------------------------------------------------------------------------

export function buildPdfHtml(
  program: Program,
  config: PDFLayoutConfig
): string {
  const theme = resolveTheme(config);
  const cols = buildVisibleColumns(config);
  const fonts = FONT_SIZE_CSS[config.fontSize];
  const fontFamily = config.fontFamily || "Inter";

  // Build google fonts URL for the chosen font
  const fontWeights = "400;500;600;700;800";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@${fontWeights}&display=swap`;

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

  const goalIcon = GOAL_ICONS[program.goal] ?? "";

  // ── Inner body HTML ────────────────────────────────────────────────────
  let inner = "";

  // Hero / Cover
  if (config.showCoverPage) {
    inner += `<div style="position:relative;overflow:hidden;padding:40px 32px 32px 32px;background:${theme.heroGradient}">`;
    inner += `<div style="position:relative;z-index:10">`;

    // Branding
    if (config.branding.coachName) {
      inner += `<div style="margin-bottom:16px;display:flex;align-items:center;gap:12px">`;
      if (config.branding.logoUrl) {
        inner += `<img src="${esc(config.branding.logoUrl)}" alt="" style="height:32px;width:auto;object-fit:contain;border-radius:4px" />`;
      }
      inner += `<span style="font-size:14px;font-weight:700;letter-spacing:0.03em;color:${theme.heroAccent}">${esc(config.branding.coachName)}</span>`;
      if (config.branding.tagline) {
        inner += `<span style="margin-left:12px;font-size:12px;font-style:italic;color:${theme.heroText}80">${esc(config.branding.tagline)}</span>`;
      }
      inner += `</div>`;
    }

    // Mode label
    inner += `<div style="font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${theme.heroText}50">${program.mode === "blocks" ? "Block-based program" : "Day-based program"}</div>`;

    // Title
    inner += `<h1 style="font-size:${fonts.hero};font-weight:800;letter-spacing:-0.02em;margin-top:4px;margin-bottom:0;color:${theme.heroText}">${esc(program.name)}</h1>`;

    // Meta
    inner += `<div style="display:flex;align-items:center;gap:16px;margin-top:12px">`;
    inner += `<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:${theme.heroAccent};text-transform:capitalize"><span style="display:inline-flex">${goalIcon}</span>${esc(program.goal)}</span>`;
    if (totalWeeks != null) {
      inner += `<span style="font-size:12px;font-weight:500;color:${theme.heroText}50">${totalWeeks} weeks</span>`;
    }
    inner += `<span style="font-size:12px;font-weight:500;color:${theme.heroText}50">${totalDays} training days${program.mode === "blocks" ? " / block" : ""}</span>`;
    inner += `</div>`;

    // Prepared for
    if (config.preparedFor) {
      inner += `<div style="margin-top:16px;padding-top:12px;border-top:1px solid ${theme.heroText}20">`;
      inner += `<span style="font-size:11px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;color:${theme.heroText}50">Prepared for</span>`;
      inner += `<div style="font-size:16px;font-weight:600;color:${theme.heroText};margin-top:2px">${esc(config.preparedFor)}</div>`;
      inner += `</div>`;
    }

    inner += `</div></div>`;
  }

  // Body
  inner += `<div style="padding:16px 32px 32px 32px;font-size:${fonts.body}">`;

  // Description (preserve HTML formatting)
  if (program.description && config.showDescription) {
    inner += `<div class="description-html" style="margin-bottom:24px;font-size:14px;color:${theme.mutedText};line-height:1.6">${program.description}</div>`;
  }

  // Block mode
  if (program.mode === "blocks" && program.blocks) {
    const sortedBlocks = [...program.blocks].sort(
      (a, b) => a.order_num - b.order_num
    );
    for (let bi = 0; bi < sortedBlocks.length; bi++) {
      inner += renderBlock(sortedBlocks[bi], bi, theme, config, cols);
    }
  } else if (program.days) {
    const sortedDays = [...program.days].sort(
      (a, b) => a.order_num - b.order_num
    );
    for (let di = 0; di < sortedDays.length; di++) {
      if (di > 0 && config.pageBreaks === "between-days") {
        inner += `<div style="break-before:page"></div>`;
      }
      inner += renderDayTable(sortedDays[di], theme, config, cols);
    }
  }

  // Footer
  if (config.footerText) {
    inner += `<div style="margin-top:32px;padding-top:16px;text-align:center;font-size:12px;border-top:1px solid ${theme.borderColor};color:${theme.mutedText}">${esc(config.footerText)}</div>`;
  }

  inner += `</div>`;

  // ── Full HTML document ─────────────────────────────────────────────────

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${fontUrl}" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 210mm;
      font-family: '${fontFamily}', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: ${theme.bodyText};
      background: ${theme.bodyBg};
    }
    @page {
      size: A4;
      margin: 0;
    }
    table { border-spacing: 0; }
    h1, h2, h3, p { margin: 0; }
    img { max-width: 100%; }
    .description-html p { margin-bottom: 0.5em; }
    .description-html ul, .description-html ol { padding-left: 1.5em; margin-bottom: 0.5em; }
    .description-html strong { font-weight: 600; }
    .description-html em { font-style: italic; }
  </style>
</head>
<body>
${inner}
</body>
</html>`;
}
