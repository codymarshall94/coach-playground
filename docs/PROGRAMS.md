# PRGRM — Program Structure

This document explains how training programs are structured in PRGRM, the two program modes, and how the hierarchy maps to both the TypeScript types and the database schema.

## Overview

A **Program** is the top-level container for a training plan. Every program has a **goal** (strength, hypertrophy, endurance, or power) and a **mode** that determines its internal structure.

```
Program
 ├── goal        (strength | hypertrophy | endurance | power)
 ├── mode        (days | blocks)
 └── content     (flat day list  ──or──  block → week → day hierarchy)
```

## Program modes

### Days mode

The simplest layout. A program contains a flat, ordered list of **days** — typically representing one training week or cycle. This is ideal for straightforward weekly splits (e.g., Push / Pull / Legs / Rest / Upper / Lower / Rest).

```
Program (mode: "days")
 └── Day 1  ─  Day 2  ─  Day 3  ─  …  ─  Day 7
```

When created via the guided setup, days mode fills out to 7 days (workout days first, rest days at the end). Users can add, remove, or reorder days freely.

### Blocks mode

Programs with periodization use **blocks**. Each block contains one or more **weeks**, and each week contains its own ordered list of **days**. This enables multi-week progressions like accumulation → intensification → peaking → deload.

```
Program (mode: "blocks")
 └── Block 1 ("Accumulation")
 │    ├── Week 1
 │    │    └── Day 1  ─  Day 2  ─  …
 │    ├── Week 2
 │    │    └── Day 1  ─  Day 2  ─  …
 │    └── Week 3
 │         └── Day 1  ─  Day 2  ─  …
 └── Block 2 ("Intensification")
      ├── Week 1
      │    └── Day 1  ─  Day 2  ─  …
      └── Week 2
           └── Day 1  ─  Day 2  ─  …
```

Blocks can be added, removed, reordered, and duplicated. Weeks within a block can be added, removed, and duplicated independently.

### Switching modes

Users can switch between days and blocks mode at any time via the builder. The conversion logic lives in `features/workout-builder/utils/program.ts`:

- **Days → Blocks**: the existing day list is wrapped into a single block with one week.
- **Blocks → Days**: the days from the first block's first week are extracted into the flat list.

## Day structure

A **Day** (`ProgramDay`) is a single training session (or rest day). Each day has:

| Field | Purpose |
|-------|---------|
| `name` | User-facing label (e.g., "Upper Body A", "Rest Day") |
| `type` | `workout`, `rest`, `active_rest`, or `other` |
| `description` | Optional notes / instructions |
| `order_num` | Position within its parent (week or flat list) |
| `groups` | Ordered list of exercise groups (empty for rest days) |

### Day types

| Type | Meaning |
|------|---------|
| `workout` | A training session with exercise groups |
| `rest` | Full rest day — no training |
| `active_rest` | Light recovery (mobility, walking, etc.) |
| `other` | Anything else (testing, sport practice, etc.) |

## Exercise groups

A **WorkoutExerciseGroup** is a collection of exercises performed together within a day. Groups define how exercises relate to each other during execution.

| Group type | Description |
|------------|-------------|
| `standard` | Exercises performed sequentially (straight sets) |
| `superset` | Two exercises alternated set-for-set |
| `giant_set` | Three or more exercises cycled through |
| `circuit` | Exercises performed back-to-back with minimal rest |

Each group has:
- An ordered list of **exercises**
- An optional `rest_after_group` (seconds between this group and the next)
- Optional `notes`

## Exercises

A **WorkoutExercise** represents a specific exercise prescribed within a group:

| Field | Purpose |
|-------|---------|
| `exercise_id` | Reference to the exercise catalog |
| `display_name` | Shown in the UI (user-editable) |
| `order_num` | Position within the group |
| `intensity` | Intensity system: `rpe`, `rir`, `one_rep_max_percent`, or `none` |
| `rep_scheme` | How reps are interpreted: `fixed`, `range`, `time`, `each_side`, `amrap`, `distance` |
| `sets` | Ordered array of `SetInfo` objects |
| `notes` | Optional per-exercise notes |

### Intensity systems

Each exercise uses one intensity system to prescribe effort:

| System | Description | Typical range |
|--------|-------------|---------------|
| `rpe` | Rate of Perceived Exertion | 1–10 |
| `rir` | Reps in Reserve | 0–5+ |
| `one_rep_max_percent` | Percentage of 1RM | 50–100% |
| `none` | No intensity prescribed | — |

## Sets

A **SetInfo** object is the most granular unit — one prescribed effort:

| Field | Purpose |
|-------|---------|
| `reps` | Rep count (or lower bound for ranges) |
| `reps_max` | Upper bound for rep ranges (e.g., 8–12) |
| `rest` | Rest period in seconds |
| `rpe` / `rir` / `one_rep_max_percent` | Intensity value (based on parent exercise's system) |
| `set_type` | Categorizes the set (see below) |
| `rep_scheme` | Per-set override of rep scheme |
| `duration` | Seconds (for time-based sets) |
| `distance` | Metres (for distance-based sets) |
| `per_side` | Whether reps are per-side (e.g., 12 each leg) |
| `notes` | Optional per-set notes |

### Set types

| Type | Description |
|------|-------------|
| `warmup` | Warm-up set — lighter load, not counted toward working volume |
| `standard` | Normal working set |
| `amrap` | As Many Reps As Possible |
| `top_set` | Heaviest set of the exercise |
| `backoff` | Reduced load after top set(s) |
| `drop` | Drop set — reduce weight and continue immediately. Uses `drop_percent` and `drop_sets` params |
| `cluster` | Cluster set — intra-set rest. Uses `cluster_reps` and `intra_rest` params |
| `myo_reps` | Myo-rep set — activation set followed by mini-sets. Uses `activation_set_reps` and `mini_sets` params |
| `rest_pause` | Rest-pause — brief pause mid-set. Uses `initial_reps` and `pause_duration` params |

## Complete hierarchy

Putting it all together, this is the full nesting for both modes:

### Days mode
```
Program
 └── ProgramDay[]
      └── WorkoutExerciseGroup[]
           └── WorkoutExercise[]
                └── SetInfo[]
```

### Blocks mode
```
Program
 └── ProgramBlock[]
      └── ProgramWeek[]
           └── ProgramDay[]
                └── WorkoutExerciseGroup[]
                     └── WorkoutExercise[]
                          └── SetInfo[]
```

## How programs are created

### Empty program
`utils/createEmptyProgram.ts` creates a minimal program with one day (days mode) or one block containing one week with one day (blocks mode). Used as the default when a user starts from scratch.

### Guided setup
`utils/createGuidedProgram.ts` creates a program from wizard answers (name, goal, mode, split count). In days mode it produces the requested number of workout days padded to 7 with rest days. In blocks mode it creates N blocks each with one week and one day.

### From template
Programs can be cloned from templates via the `clone_program_from_template` RPC. The clone gets a new `user_id` and `parent_program_id` pointing back to the source template.

## Engine analytics

The engine system computes analytics at each level of the hierarchy:

| Layer | Engine | Input | Output |
|-------|--------|-------|--------|
| **Day** | `engines/day/dayEngine.ts` | `SessionInput` (exercises + sets) | `DayMetrics` — load score, duration estimate, fatigue breakdown, muscle sets, energy system split, risk flags |
| **Week** | `engines/week/weekEngine.ts` | `DayMetrics[]` + targets | `WeekMetrics` — volume by muscle, balance ratios, intensity histogram, weekly score |
| **Block** | `engines/block/blockEngine.ts` | `WeekMetrics[]` | `BlockMetrics` — volume/intensity trends, deload detection, block score |
| **Program** | `engines/program/programEngine.ts` | `ProgramSpec` + `BlockMetrics[]` | `ProgramMetrics` — goal fit score, sub-scores, coverage heatmap, global insights |

The orchestrator (`engines/main/orchestrator.ts`) stitches all layers together via a single `computeAll()` call. The UI consumes results through the `useProgramEngine` hook, which memoizes computation and also generates coach nudges and improvement plans.

## Database mapping

The in-memory TypeScript types map directly to database tables:

| Type | Table |
|------|-------|
| `Program` | `programs` |
| `ProgramBlock` | `program_blocks` |
| `ProgramWeek` | `program_weeks` |
| `ProgramDay` | `program_days` |
| `WorkoutExerciseGroup` | `workout_exercise_groups` |
| `WorkoutExercise` | `workout_exercises` |
| `SetInfo` | `exercise_sets` |

In days mode, `program_days` rows have `block_id = NULL` and `week_id = NULL`. In blocks mode, every day belongs to a week which belongs to a block. See [DATABASE.md](DATABASE.md) for full column details and RLS policies.
