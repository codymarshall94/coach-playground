# PDF Designer & Export — Overhaul Plan

> **Status**: Phases 1–4 complete. Phase 5 in progress.
>
> **Goal**: Make the PDF designer and export feel like Canva — what you see on screen is exactly what you get in the downloaded file.

---

## Problem Statement

Coaches who sell training programs need professional, branded PDF exports. The old system had two completely separate renderers: an HTML/Tailwind in-browser preview and a `@react-pdf/renderer` server-side export. They shared duplicated formatting logic and inevitably drifted apart — different fonts, different spacing, rich text stripped out, no images, no custom fonts. The export never matched the preview.

---

## Architecture Decision

**Single-renderer: HTML → PDF via Puppeteer.**

The preview IS the PDF. Headless Chromium prints the same HTML to a pixel-perfect PDF file. This eliminates the dual-renderer drift by definition and unlocks full CSS capabilities (Google Fonts, gradients, images, flexbox, `break-before: page`, etc.).

| Concern | Approach |
|---------|----------|
| Server PDF rendering | `puppeteer-core` + `@sparticuz/chromium` (Vercel-compatible) |
| HTML generation | Pure TypeScript function (`buildPdfHtml`) — no React/JSX needed |
| Shared logic | `utils/pdfHelpers.ts` — formatting, grouping, theme resolution |
| Config persistence | `pdf_config jsonb` column on `programs` table (Phase 2) |

---

## Phases

### Phase 1 — Single-Renderer Foundation ✅

**Shipped**: Replaced `@react-pdf/renderer` with Puppeteer HTML-to-PDF pipeline.

| What changed | Details |
|---|---|
| **Deleted** `components/ProgramPDF.tsx` | 974-line `@react-pdf/renderer` component — gone |
| **Removed** `@react-pdf/renderer` dependency | Uninstalled from package.json |
| **Created** `utils/pdfHelpers.ts` | Shared formatting helpers, theme resolution, column builder — single source of truth |
| **Created** `utils/buildPdfHtml.ts` | Pure-function HTML builder that generates a complete A4 document with inline styles + Inter font |
| **Rewrote** `app/api/export-pdf/route.ts` | Puppeteer-based: builds HTML string → headless Chrome → `page.pdf()` → download |
| **Updated** `PDFPreviewSheet.tsx` | Imports from shared `pdfHelpers.ts` — no more duplicated code |
| **Updated** `PDFLayoutPlanner.tsx` | Added sonner toast notifications for export success/failure |
| **Updated** `next.config.ts` | Added `serverExternalPackages` for puppeteer-core and @sparticuz/chromium |

**Key files:**
- `utils/pdfHelpers.ts` — shared helpers (formatRestTime, formatIntensity, resolveTheme, etc.)
- `utils/buildPdfHtml.ts` — generates the full HTML document string for Puppeteer
- `app/api/export-pdf/route.ts` — Puppeteer PDF generation endpoint
- `features/.../PDFPreviewSheet.tsx` — in-browser preview (now uses shared helpers)

---

### Phase 2 — Config Persistence ✅

Save `PDFLayoutConfig` per program so settings survive across sessions.

- [x] Add `pdf_config jsonb` column to `programs` table (Supabase migration)
- [x] Add `pdf_config?: PDFLayoutConfig` to the `Program` type
- [x] Include `pdf_config` in `PROGRAM_DETAIL_SELECT`, `insertProgram()`, `updateProgram()`, `restoreProgramVersion()`
- [x] Auto-save config from the designer (debounced 1.5s)
- [x] Initialize from `program.pdf_config ?? DEFAULT_PDF_LAYOUT` with `hydrateConfig()` forward-compat merge
- [x] Pre-fill branding from `profiles.brand_name` / `profiles.logo_url` on first open
- [x] Added `savePdfConfig()` lightweight service function
- [x] Saving/Unsaved indicator in planner header

---

### Phase 3 — Branding & Cover Page Upgrade ✅

Make the PDF feel like a premium coaching document.

- [x] **Logo URL field** — input + preview in sidebar → renders in hero header (both preview & PDF)
- [x] **"Prepared for" field** — `preparedFor` string in config, sidebar UI, renders on cover in both renderers
- [x] Updated hero layout to accommodate logo + client name

---

### Phase 4 — Typography & Page Structure ✅

- [x] **Custom font selection** — 8 Google Fonts (Inter, Roboto, Oswald, Lora, Montserrat, Playfair Display, Raleway, Source Sans 3)
  - `fontFamily` field in config
  - Font picker grid in sidebar
  - Dynamic Google Fonts `<link>` in both PDF HTML and preview
- [x] **Page numbering** — via Puppeteer's `displayHeaderFooter` + `footerTemplate`
  - `showPageNumbers: boolean` in config
  - Preview shows page number indicator
- [ ] **Table of contents** — future (auto-generated for multi-block programs)

---

### Phase 5 — Preview Zoom ✅

- [x] **Zoom control** — ZoomIn/ZoomOut buttons + percentage display in planner header (50%–150%, 10% increments)
  - Click percentage to reset to 75%
  - CSS `transform: scale()` on page container
  - Persisted in localStorage

---

## Verification Checklist

- [ ] Fidelity: preview screenshot vs exported PDF are visually identical
- [ ] Round-trip: save config → refresh → reopen → config restored
- [ ] Logo: appears in both preview and PDF
- [ ] Large programs: 4-block, 16-week program exports within timeout
- [ ] `npm run lint` and `npm run build` pass after each phase
- [ ] Docs updated: DATABASE.md, PRODUCT.md, ARCHITECTURE.md, help/export-pdf

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Vercel 50MB function limit | `@sparticuz/chromium` is the standard solution, ~45MB compressed |
| Vercel 10s/60s timeout | `maxDuration = 60` on the route; stream response for very large programs |
| Font loading in Puppeteer | `waitUntil: "networkidle0"` ensures Google Fonts are loaded before print |
| Cover images in PDF | Puppeteer loads images from URLs natively — `waitUntil: "networkidle0"` handles this |
