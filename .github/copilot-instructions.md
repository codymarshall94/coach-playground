# PRGRM — Copilot Instructions

## Project context

* [Product Vision and Goals](docs/PRODUCT.md): What PRGRM does, who it's for, and key user flows.
* [System Architecture](docs/ARCHITECTURE.md): Directory layout, layer responsibilities, and design patterns.
* [Program Structure](docs/PROGRAMS.md): Program hierarchy, days vs blocks, exercise groups, sets, and engine analytics.
* [Design System](docs/DESIGN.md): Color tokens, typography, components, theming, and visual conventions.
* [Contributing Guidelines](docs/CONTRIBUTING.md): Dev setup, coding conventions, and PR workflow.
* [Database Schema](docs/DATABASE.md): Supabase tables, relationships, and RLS notes.
* [Running TODO List](TODO.md): Bugs, suspicious code, tech debt, and UX papercuts noticed during development. Add to this whenever you spot something off — we revisit it periodically.

Suggest updates to these docs if you find incomplete or conflicting information during your work.

## Coding rules

- **TypeScript** — strict types, no `any` unless unavoidable; prefer interfaces over type aliases for objects.
- **React** — functional components only; use `"use client"` only where needed.
- **Styling** — Tailwind CSS utility classes; use `cn()` from `lib/utils` for conditional classes.
- **UI primitives** — use existing shadcn/ui components in `components/ui/` before adding new ones.
- **Hooks** — prefer existing hooks in `hooks/` and `features/*/hooks/` over new abstractions.
- **Engine logic** — keep analytics pure (no React, no side effects) inside `engines/`. UI consumes results via `useProgramEngine`.
- **Services** — Supabase data-access lives in `services/`; don't call Supabase directly from components.
- **No secrets** — never include environment values, keys, or credentials in generated code.

## Safety

- If a request could produce harmful content, respond: "Sorry, I can't assist with that."
- Ask clarifying questions before making large API or architecture changes.

## Workflow

- Keep changes small and focused.
- Run `npm run lint` and `npm run build` before finalizing.
- When uncertain about conventions, prefer asking rather than guessing.
