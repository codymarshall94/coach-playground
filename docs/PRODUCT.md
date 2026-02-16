# PRGRM — Product Vision

## What it is

PRGRM is a workout-program builder and analyzer for coaches and self-coached athletes. Users design structured training programs, receive real-time analytics, and export finished programs — no account required to start building.

## Who it's for

- Strength & conditioning coaches writing programs for clients.
- Self-coached lifters who want volume/intensity feedback while planning.
- Fitness enthusiasts exploring template programs.

## Core user flows

1. **Browse templates** (`/programs/templates`) — pick a starting point or start from scratch.
2. **Build a program** (`/programs/builder`) — add blocks, days, exercise groups, exercises, and sets with drag-and-drop reordering.
3. **Receive live feedback** — engine analytics (volume, intensity distribution, muscle balance heatmap, coach nudges) update as the program changes.
4. **Preview & export** — full-program preview dialog; export to PDF.
5. **Save & share** — sign in to persist programs; share via public profile (`/u/[slug]`).

## Key concepts

| Term | Meaning |
|------|---------|
| **Program** | Top-level container; has a goal (strength / hypertrophy / endurance / power) and a mode (days or blocks). |
| **Block** | Optional grouping of days (e.g., "Accumulation 4 wk"). Only used in block mode. |
| **Day** | A single training session (workout, rest, active rest, or other). |
| **Exercise Group** | A set of exercises performed together (standard, superset, giant set, circuit). |
| **Set** | One prescribed effort — reps, intensity (RPE / RIR / %1RM), rest, and optional advanced type (drop, cluster, myo-rep, rest-pause). |

## Design principles

- **No sign-up wall** — building is free; auth gates saving/sharing only.
- **Engine-driven feedback** — analytics are computed by pure functions, not the server.
- **Progressive disclosure** — simple defaults first; advanced options (set types, intensity systems) revealed on demand.
