# PRGRM — Feature Audit

> Snapshot taken **2026-02-21**. Covers every route, feature, service, and engine in the codebase with gaps and recommendations.

---

## Table of Contents

1. [App Routes](#1-app-routes)
2. [Core Features](#2-core-features)
3. [User Flows](#3-user-flows)
4. [Services & Data Layer](#4-services--data-layer)
5. [Engine / Analytics](#5-engine--analytics)
6. [UI Components Inventory](#6-ui-components-inventory)
7. [Gaps & Missing Features](#7-gaps--missing-features)

---

## 1. App Routes

### Public (no auth)

| Route | Description |
|---|---|
| `/` | Marketing landing page — hero, engine showcase, metrics grid, "How it works". Forced light theme. |
| `/login` | Email+password login/signup form. Redirects to `/programs` if already authenticated. Supports `?redirect=` param. |
| `/error` | Bare error fallback — just `<p>Sorry, something went wrong</p>`. |
| `/help` | Help center home — search + "Most Read" articles (sidebar layout). |
| `/help/[topic]` | 14 static help articles (creating-your-first-workout, exercise-groups, exercise-library, export-pdf, faq, intensity-systems, navigating-builder, program-analytics, reorder-days, save-preview, set-types, sharing-profiles, templates, using-blocks). |
| `/u/[slug]` | Public user profile — avatar, cover, bio, social links, published programs. Dynamic OG metadata. |
| `/not-found` | Custom 404 with SVG illustration. |

### Authenticated

| Route | Description |
|---|---|
| `/programs` | Dashboard — list of user's programs with delete & "Delete All". Shows `ProfilePromptDialog`. |
| `/programs/new` | Pre-builder: "Help me set it up" (guided wizard) or "I'll do it myself". Links to templates. |
| `/programs/builder` | Workout builder. Accepts `?template=` to clone from a template. Supports unauthenticated preview mode. |
| `/programs/[id]` | Edit existing program — loads full tree from DB into builder. |
| `/programs/templates` | Template gallery grouped by goal (hypertrophy, strength, power, endurance). |
| `/profile` | Routing hub: redirects to `/profile/setup` if incomplete, otherwise `/u/[username]`. |
| `/profile/setup` | 5-step wizard: Basics → Username → About → Photos → Done. |

### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/export-pdf` | POST | Accepts `{program, config}`, renders PDF server-side via `@react-pdf/renderer`, returns binary. |
| `/api/programs/delete` | POST | Server-side deletion with ownership check. Falls back to service role if RLS blocks. |
| `/auth/signout` | POST | Signs out user, revalidates, redirects to `/login`. |

### Admin

| Route | Description | Status |
|---|---|---|
| *(removed)* | Admin exercise creation (`/admin/exercises/create`) was deleted — broken no-op with no auth guard. | **Removed 2026-02-21** |

### Middleware

`middleware.ts` runs `updateSession()` on all non-static routes to refresh the Supabase auth session cookie.

---

## 2. Core Features

### A. Workout Builder

The heart of the application. Lives in `features/workout-builder/`.

| Capability | Details |
|---|---|
| **Structure modes** | **Days** (flat weekly schedule) or **Blocks** (periodized: blocks → weeks → days) |
| **Day management** | Add, remove, reorder, duplicate, rename, describe. Day types: workout, rest, active_rest, other. |
| **Block management** | Add, remove, reorder, duplicate, rename blocks. Add/remove/duplicate weeks within blocks. |
| **Exercise library** | Filterable by muscle, category, equipment, skill level. Searchable. |
| **Exercise groups** | Standard, superset, giant set, circuit. Drag-and-drop reorder. |
| **Set types** | Standard, warmup, AMRAP, drop, cluster, myo-reps, rest-pause, top set, backoff, other. |
| **Intensity systems** | RPE, RIR, %1RM, or none — per exercise. |
| **Rep schemes** | Fixed, range, time, each_side, AMRAP, distance — with quick-pick presets and validation. |
| **Per-set fields** | Reps, rest, RPE, RIR, %1RM, notes, per-side toggle, duration, distance. |
| **Drag-and-drop** | Exercises, groups, days — via dnd-kit. |
| **Inline editing** | Day names, day descriptions, program name, program description. |
| **Quick-add suggestions** | Contextual exercise suggestions based on current workout. |
| **Keyboard shortcuts** | ← → (nav days), L (library), I (insights), Ctrl+S (save), ? (help modal). |
| **Unsaved changes guard** | `beforeunload`, link click capture, browser back/forward interception. |
| **Save** | Creates or updates program. Delete-all + re-insert strategy. Button shows dirty/clean state with amber dot. |
| **Program settings** | Name, description, goal, mode switch, cover image upload. |
| **Welcome modal** | 4-slide onboarding, shown once via localStorage. |

### B. Analytics Engine

Pure computation in `engines/`. No React dependencies.

| Layer | Scope | Key Outputs |
|---|---|---|
| **Day Engine** | Per-session | Load score (0–10), fatigue breakdown (CNS/metabolic/joint), energy system mix (ATP-CP/glycolytic/oxidative), muscle activation (weighted+raw), movement pattern coverage, risk flags, estimated duration. |
| **Week Engine** | Per-week | Stress roles (High/Medium/Low via z-score), spacing flags, volume-by-muscle, balance ratios (push:pull, quad:ham, upper:lower), intensity histogram, weekly score. |
| **Block Engine** | Per-block | Volume trend (rising/flat/falling), intensity trend, deload detection (≥30% volume drop), block score. |
| **Program Engine** | Full program | Goal-fit score (0–100) with 7 sub-scores: specificity, progression, stress patterning, volume fit, intensity fit, balance health, feasibility. Weights vary by goal. Monotony, strain, recommended minutes band, top/low-attention muscles. |
| **Coach Nudges** | Per-week | Spacing fixes, balance corrections, coverage vs targets, intensity mix by goal, time cap warnings. |
| **Improvement Plan** | Full program | Ranked actions with estimated point gains. Priority tiers: high (≥8pts), medium (≥4pts), low. |

### C. PDF Export

| Component | Details |
|---|---|
| **Server-side render** | `@react-pdf/renderer` at `/api/export-pdf`. |
| **PDF document** | `ProgramPDF.tsx` (624 lines) — supports days and blocks mode. |
| **Layout config** | 5 themes (clean, bold, minimal, dark, sport), branding (coach name, tagline, logo), font size, table density, page break control, section visibility toggles. |
| **In-app preview** | `PDFPreviewSheet` — HTML preview matching PDF layout/theme. |
| **Layout planner** | `PDFLayoutSidebar` + `PDFLayoutPlanner` — full-screen layout customization. |

### D. Profile System

| Component | Details |
|---|---|
| **Setup wizard** | 5 steps: basics (name, account type), username (auto-slug from email), about (bio, socials), photos (avatar, logo, cover), done. |
| **Account types** | Personal or Brand. |
| **Storage** | Avatars in `avatars` bucket, logo + cover in `profile-assets` bucket. |
| **Public profile** | `/u/[slug]` — OG metadata, programs list (marketplace-style cards), social links. |
| **Profile prompt** | `ProfilePromptDialog` on dashboard, `ProfileSetupBanner` in builder — nudge incomplete profiles. |

### E. Template System

| Component | Details |
|---|---|
| **Templates** | Regular programs with `is_template = true`. |
| **Gallery** | `/programs/templates` — grouped by goal, each with preview info. |
| **Clone flow** | Authenticated: `clone_program_from_template` RPC. Unauthenticated: direct load for preview. |

### F. Help Center

| Component | Details |
|---|---|
| **Articles** | 14 topics covering all major features. |
| **Search** | Full-text client-side search via `useHelpSearch`. |
| **Navigation** | Sidebar layout with "Most Read" section. |

### G. UI Insights (In-Builder)

Two analytics panels accessed while building:

1. **Workout Analytics Panel** — per-day session load dial, fatigue bars, energy system chart, movement coverage, muscle heatmap (react-body-highlighter), volume table, balance ratios.
2. **Program Overview Panel** — goal-fit score dial with sub-score breakdown, improvement plan, full-body muscle heatmap, balance ratios, monotony/strain.

---

## 3. User Flows

### Flow 1: Anonymous → Build → Sign Up → Save

```
Landing (/) → "Start Building" → /programs/new
  → Guided wizard OR blank builder → /programs/builder
  → Build workout → Click Save → SavePromptModal (not authed)
  → Sign up → Save creates program → /programs/[id]
```

### Flow 2: Dashboard → Edit Existing

```
/programs → Click program card → /programs/[id]
  → Edit in builder → Save → Updates existing program
```

### Flow 3: Template → Clone → Customize

```
/programs/new → "Use a Template" → /programs/templates
  → Pick template → /programs/builder?template=[id]
  → Clone via RPC → Customize → Save
```

### Flow 4: Sign Up → Profile Setup

```
/login → Sign up → Auto-generate username from email
  → Redirect to /profile/setup → 5-step wizard
  → Complete → Redirect to /u/[username]
```

### Flow 5: Export PDF

```
Builder → Open PDF preview sheet
  → Configure layout (theme, branding, sections, density)
  → Export → POST /api/export-pdf → Download PDF
```

### Flow 6: View Public Profile

```
/u/[slug] → See avatar, cover, bio, social links
  → Browse published programs (marketplace cards)
```

---

## 4. Services & Data Layer

| Service | Scope | Purpose |
|---|---|---|
| `programService.ts` | Client | Full CRUD for programs. Save = delete-all children + re-insert (documented rationale). 566 lines. |
| `programQueries.ts` | Shared | Single source of truth for PostgREST select strings (`PROGRAM_DETAIL_SELECT`, `PROGRAM_INDEX_SELECT`). |
| `profileService.ts` | Server | `getProfileBySlug`, `getProfileById`, `updateProfile`, `getPublicProgramsByUserId`. |
| `profileClientService.ts` | Client | Storage uploads (avatar, logo, cover), client-side profile update. |
| `authService.ts` | Client | `signUpUser`, `setUserProfile`, `handleSignInWithGoogle` (Google ID token flow). |
| `exerciseService.ts` | Client | `getAllExercises()` — fetches from Supabase, shapes into `Exercise[]`. |
| `templateService.ts` | Client | `getTemplates()` (list), `getTemplateByIdFull()` (single with full tree). |
| `coverImageService.ts` | Client | Upload/delete program cover images in `program-covers` bucket. |
| `programs/deleteProgram.ts` | Client | Direct client-side delete — **appears unused** (deletion goes through API route). |

### Supabase Infrastructure

- **11 tables**: programs, program_blocks, program_weeks, program_days, workout_exercise_groups, workout_exercises, exercise_sets, exercises, exercise_muscles, muscles, profiles
- **3 storage buckets**: avatars, profile-assets, program-covers
- **3 RPCs**: `clone_program_from_template`, `is_program_accessible`, `is_program_owner`
- **Auth**: Email/password + Google ID token (GSI script in layout)
- **Triggers**: Auto-create profile row on user sign-up

---

## 5. Engine / Analytics

| Metric | Scope | Source |
|---|---|---|
| Session load (0–10) | Per-day | `dayEngine.ts` |
| Fatigue (CNS / metabolic / joint) | Per-exercise | `fatigue.ts` |
| Energy system mix | Per-set | `energy.ts` |
| Muscle activation (weighted sets) | Per-day | `dayEngine.ts` |
| Movement pattern coverage | Per-day | `dayEngine.ts` |
| Risk flags | Per-day | `dayEngine.ts` |
| Stress roles (High / Med / Low) | Per-week | `weekEngine.ts` via z-score |
| Volume by muscle | Per-week | `weekEngine.ts` |
| Balance ratios | Per-week | `balance.ts` |
| Spacing flags | Per-week | `spacing.ts` |
| Volume / intensity trends | Per-block | `blockEngine.ts` |
| Deload detection | Per-block | `blockEngine.ts` |
| Goal-fit score (0–100) | Program | `scoring.ts` (7 weighted sub-scores) |
| Monotony & strain | Program | `scoring.ts` (Foster model) |
| Coach nudges | Per-week | `coachNudges.ts` |
| Improvement plan | Program | `improvementPlan.ts` |
| ETL (training load) | Per-exercise | `etl.ts` |
| Formulas (1RM, Wilks, volume) | Utility | `formulas.ts` |

---

## 6. UI Components Inventory

### App-Level Components (26 files)

Navbar, Logo, ProgramsView, ProgramCard, NoProgramsEmpty, ProgramsSkeleton, ProgramPDF, ProfileSetupWizard, ProfileSetupBanner, ProfilePromptDialog, MuscleHeatmap, ScoreDial, SmartInput, RichTextEditor, NotesPopover, ThemeToggle, WelcomeModal, EmptyState, HighlightedText, InfoTooltip, TermTooltip, VolumeUnitTooltip, ProgressIndicator, UserNameSlugInput, Droppable, SortableItem

### shadcn/ui Primitives (27 files)

accordion, alert-dialog, alert, avatar, badge, button, card, checkbox, collapsible, dialog, dropdown-menu, hover-card, input, label, popover, progress, scroll-area, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea, tooltip

### Builder Feature Components (~45 files)

**Days**: DayHeader, DayNameEditor, DayDescriptionEditor, ClearWorkoutDayModal
**Exercises**: ExerciseLibrary, ExerciseCard, ExerciseBuilderCard, ExerciseGroupCard, ExpandedExerciseCard, CollapsedExerciseCard, ExerciseDetailModal, QuickAddSuggestions, AddToGroupPopover, AdvancedSetFields, SetTypeSelector, RepSchemePopover, GroupTypeSelector, FilterPopover, SortPopover
**Program**: ProgramDaySelector, BlockSelector, ProgramMetaEditor, ProgramSettingsSheet, ProgramSettingsModal, ProgramCalendarDialog, ProgramPreview, ProgramOverviewPanel, BlockOverviewPanel, ModeSwitchDialog, PDFPreviewSheet, PDFLayoutSidebar, PDFLayoutPlanner, ProgramNotesModal
**Insights**: WorkoutAnalyticsPanel, EtlDisplay, FatigueBreakdown, EnergySystemChart, MuscleActivationChart, MuscleVolumeRow, RatioIndicator, MetricCard, TopMusclesList
**Auth/Onboarding**: AuthForm, AvatarDropdown, SignUpWithProfileForm, SavePromptModal, KeyboardShortcutsModal, GuidedSetupWizard, PreBuilder, TemplateChooser, ProfileDetailsForm, InlineNameEditor, ProgramDescriptionEditor

---

## 7. Gaps & Missing Features

### 🔴 Critical / Broken

- [x] ~~**#1 — No password reset flow** — No "Forgot password?" link, no reset page, no reset action. Users who forget their password are locked out.~~ ✅ *Fixed 2026-02-21*
- [x] ~~**#2 — Admin exercise creation is a no-op** — `/admin/exercises/create` — submit handler has `// TODO: call backend API`. Form renders but does nothing.~~ ✅ *Fixed 2026-02-21 — route removed*
- [x] ~~**#3 — No admin route protection** — `/admin/exercises/create` has no auth or role check. Publicly accessible (though non-functional).~~ ✅ *Fixed 2026-02-21 — route removed*
- [x] ~~**#4 — Google sign-in nonce is a placeholder** — `authService.ts` used hardcoded `"<NONCE>"`. Google ID token verification would fail or be insecure.~~ ✅ *Fixed 2026-02-21*
- [x] ~~**#5 — Error page is bare** — `/error` was just `<p>Sorry, something went wrong</p>`. No layout, nav, retry button, or error details.~~ ✅ *Fixed 2026-02-21*
- [x] ~~**#6 — Navbar links to `/signup` which doesn't exist** — Mobile sheet menu for unauthenticated users had a "Get Started" link to `/signup`. This route returns 404.~~ ✅ *Fixed 2026-02-21*

### 🟡 Medium Priority

- [x] ~~**#7 — Block/program engine projects fake data** — `orchestrator.ts` duplicates the single computed week 4× for block metrics, and the single block 4× for program metrics. Multi-week scoring is based on projected — not actual — data.~~ ✅ *Fixed 2025-06-21*
- [x] ~~**#8 — No email verification handling** — `signUp` is called but there's no confirmation page or email verification flow visible.~~ ✅ *N/A — email confirmation is disabled in Supabase*
- [x] ~~**#9 — Duplicate program from dashboard is unwired** — `ProgramCard` accepts `onDuplicate` prop but `ProgramsView` never passes it. The dropdown item exists but does nothing.~~ ✅ *Fixed 2026-02-21*
- [ ] **#10 — No program privacy/visibility controls** — Public profiles show all non-template programs. No way to mark a program as private vs. public.
- [ ] **#11 — No search or filter on programs dashboard** — `/programs` lists all programs with no search, goal filtering, or sort options. Will get unwieldy as users create more programs.
- [ ] **#12 — Landing page ignores dark mode** — Hardcoded `bg-white text-black` classes. Theme toggle exists but landing page won't respect it.
- [ ] **#13 — Module-scope Supabase clients risk stale auth** — `programService.ts`, `coverImageService.ts`, `profileClientService.ts` all create `const supabase = createClient()` at module scope. Flagged in TODO.md but unresolved.
- [x] ~~**#14 — `UserProvider` context is dead code** — `contexts/UserProvider.tsx` is 100% commented out. Should be deleted.~~ ✅ *Fixed 2026-02-21*
- [ ] **#15 — `WorkoutBuilderProvider` appears unused** — Provider wraps `useWorkoutBuilder` but the actual builder calls the hook directly. Nothing imports the provider.
- [x] ~~**#16 — `services/programs/deleteProgram.ts` appears orphaned** — Client-side delete service exists but actual deletion routes through `/api/programs/delete`.~~ ✅ *Fixed 2026-02-21*

### 🔵 Missing Features (for a workout app)

- [ ] **#17 — Workout logging / tracking** — The app is purely a program *builder*. No way to log actual workouts, track weight lifted, or record completed sets. Natural next major feature.
- [x] **#18 — Program versioning / undo** — ✅ Fixed 2025-06-21 — Added `program_versions` table with auto-increment trigger and RLS. `saveOrUpdateProgramService` auto-snapshots before destructive save. Version history panel in program settings with one-click restore.
- [ ] **#19 — Program sharing via link** — Users can see programs on public profiles, but there's no direct program share link or embed capability.
- [ ] **#20 — Program import / export (JSON)** — No way to export a program as structured data (JSON/CSV) for backup or migration. Only PDF export exists.
- [ ] **#21 — User-to-user program assignment** — No coach → client flow where a coach assigns a program to a specific user.
- [ ] **#22 — Notifications / activity** — No notification system for any events (profile views, program shares, etc.).
- [ ] **#23 — Exercise custom creation (user-level)** — Users can't add their own exercises. No user-facing exercise creation exists.
- [ ] **#24 — Program folders / organization** — No way to group programs into folders or categories on the dashboard.
- [ ] **#25 — Accessibility audit** — Some ARIA attributes exist (ScoreDial has `role="meter"`) but no systematic a11y coverage for complex builder interactions.

### 📋 UX Papercuts

- [ ] **#26 — No loading state for program edit page** — `programs/[id]` shows `<p>Failed to load program</p>` on error with no recovery UI.
- [x] ~~**#27 — Missing movement patterns in engine** — `MovementPattern` type doesn't include `sprint` or `throw`, but Exercise `category` includes both.~~ ✅ *Fixed 2026-02-21*
- [x] ~~**#28 — `score.ts` overlaps with engine scoring** — `utils/score.ts` has recovery warnings and scoring logic that may duplicate engine output. Canonical source is unclear.~~ ✅ *Fixed 2026-02-21*
- [ ] **#29 — Help article dates are inconsistent** — Some show `2024-06-01`, one shows `2026-02-17`. Hardcoded, not dynamic.
- [ ] **#30 — No onboarding for analytics panel** — The insights panel is powerful but has no in-app explanation of what the metrics mean for first-time users.

### 📌 Open Items from TODO.md

- [ ] `SmartInput` decimal data — may have stale decimal values in saved data
- [ ] `coverImageService.ts` module-scope Supabase client stale auth risk
- [ ] `ExerciseGroupCard` props use `any[]` typing
- [ ] ETL calibration — formula recently adjusted, needs monitoring

---

*Last updated: 2026-02-21*
