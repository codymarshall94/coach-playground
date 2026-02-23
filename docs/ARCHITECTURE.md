# PRGRM — System Architecture

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, Turbopack dev) |
| Language | TypeScript 5, strict mode |
| UI | React 19, Tailwind CSS 4, shadcn/ui (new-york style) |
| Data fetching | TanStack React Query 5 |
| Database & Auth | Supabase (Postgres, RLS, SSR helpers) |
| Drag-and-drop | dnd-kit |
| Rich text | TipTap |
| PDF export | puppeteer-core + @sparticuz/chromium (HTML → PDF) |
| Fuzzy search | Fuse.js |
| Theming | next-themes (system / light / dark) |

## Directory layout

```
app/                     # Next.js App Router — pages & server actions
  programs/              #   builder, templates, [id] view
  u/[slug]/              #   public user profile
  login/                 #   auth (server actions)
  help/                  #   static help articles
components/              # Shared UI components
  ui/                    #   shadcn primitives
config/                  # App-level constants & feature flags
constants/               # Domain constants (muscles, equipment, glossary)
contexts/                # React context providers (Theme)
engines/                 # Pure analytics computation — NO React
  core/                  #   shared types, math, taxonomy
  day/                   #   per-session metrics
  week/                  #   weekly aggregation
  block/                 #   block-level aggregation
  program/               #   program-level metrics
  coach/                 #   coach nudges (actionable suggestions)
  main/                  #   orchestrator — single computeAll() entry point
features/                # Feature-scoped modules
  workout-builder/       #   components, hooks, providers, utils, dnd
  help/                  #   help-page feature code
hooks/                   # Shared custom hooks
lib/                     # General utilities (cn())
services/                # Supabase data-access layer
types/                   # TypeScript type definitions
utils/                   # Pure utility functions
  supabase/              #   client / server / middleware Supabase helpers
```

## Layer responsibilities

### Engines (`engines/`)
Pure functions — no React imports, no side effects, no database calls. Compute volume, intensity, muscle balance, fatigue, and coach nudges from a `ProgramSpec` + `SessionInput[]`. The UI consumes results via the `useProgramEngine` hook.

### Services (`services/`)
Supabase data-access. Each service owns one domain (programs, exercises, profiles, templates). Components never call Supabase directly.

### Hooks (`hooks/`)
Bridge between services/engines and React components. Key hooks:
- `useWorkoutBuilder` — local state machine for the builder (add/remove/reorder blocks, days, groups, exercises, sets).
- `useProgramEngine` — memoised `computeAll()` wrapper returning metrics + nudges.
- `usePrograms`, `useExercises`, `useTemplates` — React Query wrappers.

### Features (`features/`)
Self-contained feature folders with their own `components/`, `hooks/`, `providers/`, `utils/`, and `dnd/` sub-directories.

## Key patterns

1. **Engine/UI separation** — all analytics logic lives in `engines/`; UI only renders derived results.
2. **Dual program modes** — programs can be flat "days" or nested "blocks → days". Mode toggling is handled in `useWorkoutBuilder` utils.
3. **Server actions over API routes** — auth and mutations use Next.js `"use server"` actions, not route handlers.
4. **Progressive `"use client"`** — only components that need browser APIs or hooks are marked client; layouts and pages default to server.
5. **Feature folders** — complex features are isolated in `features/` to prevent cross-feature coupling.
