# PRGRM — Database Schema

All tables live in the `public` schema on Supabase (Postgres). RLS is enabled on user-owned tables.

## Table overview

```
programs
 ├── program_blocks        (optional, block-mode only)
 │    └── program_weeks
 │         └── program_days
 └── program_days           (direct children in day-mode)
      └── workout_exercise_groups
           └── workout_exercises
                └── exercise_sets

exercises                   (reference / lookup)
exercise_muscles            (join: exercises ↔ muscles)
muscles                     (reference / lookup)
profiles                    (user profiles, FK → auth.users)
```

## Tables

### `programs`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | `gen_random_uuid()` |
| user_id | uuid FK → auth.users | nullable (templates have no owner) |
| name | text | required |
| description | text | nullable, HTML |
| goal | enum `program_goal` | strength, hypertrophy, endurance, power |
| mode | enum `program_mode` | days, blocks (default: days) |
| is_template | bool | default false |
| parent_program_id | uuid FK → programs | set when cloned from a template |
| created_at, updated_at | timestamptz | auto |

### `program_blocks`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| program_id | uuid FK → programs | cascade |
| name | text | required |
| description | text | nullable |
| week_count | int | default 4, CHECK ≥ 1 (legacy count — prefer program_weeks rows) |
| order_num | int | positional |

### `program_weeks`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | `gen_random_uuid()` |
| block_id | uuid FK → program_blocks | cascade |
| week_number | int | ≥ 1, positional within block |
| label | text | nullable, e.g. "Week 1", "Deload" |
| order_num | int | positional |
| created_at, updated_at | timestamptz | auto |

### `program_days`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| program_id | uuid FK → programs | |
| block_id | uuid FK → program_blocks | nullable (day-mode) |
| week_id | uuid FK → program_weeks | nullable (day-mode, or legacy data) |
| name | text | required |
| description | text | nullable |
| type | enum `day_type` | workout, rest, active_rest, other |
| order_num | int | positional |

### `workout_exercise_groups`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| program_day_id | uuid FK → program_days | |
| order_num | int | |
| type | enum `group_type` | standard, superset, giant_set, circuit |
| notes | text | nullable |
| rest_after_group | int | seconds, nullable |

### `workout_exercises`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| workout_group_id | uuid FK → workout_exercise_groups | |
| exercise_id | text FK → exercises | |
| display_name | text | |
| order_num | int | |
| intensity | enum `intensity_system` | rpe, rir, one_rep_max_percent, none |
| rep_scheme | text | fixed, range, time, each_side, amrap (default: fixed) |
| notes | text | nullable |

### `exercise_sets`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| workout_exercise_id | uuid FK → workout_exercises | |
| set_index | int | positional |
| set_type | enum `set_type` | warmup, standard, amrap, drop, cluster, myo_reps, rest_pause, top_set, backoff, other |
| reps | int | nullable, CHECK ≥ 0 |
| rest | int | seconds, nullable |
| rpe | numeric | nullable, CHECK 0–10 |
| rir | numeric | nullable |
| one_rep_max_percent | numeric | nullable |
| notes | text | nullable |
| params | jsonb | advanced set type params |
| per_side | bool | default false — reps counted per side |
| duration | int | seconds, nullable — for time-based sets |
| distance | numeric | nullable — metres / yards for sprint-type sets |

### `exercises`
Reference table with rich metadata. Key columns: `id` (text PK), `name`, `category`, `equipment[]`, `compound`, `unilateral`, `cns_demand`, `fatigue_index`, `joint_stress`, `metabolic_demand`, `energy_system`, `ideal_rep_range[]`, `volume_per_set` (jsonb), `tracking_type[]`.

`tracking_type` (text[], default `{"reps"}`) lists the metrics an exercise can be measured by: `reps`, `time`, or `distance`. An exercise may support multiple tracking modes — e.g. A-Skips can be tracked by reps or distance (`{"reps","distance"}`). The RepSchemePopover unions the allowed scheme sets for all tracking types.

> **Note:** The legacy `activation_map` (jsonb) column has been removed. Muscle activation data lives exclusively in the `exercise_muscles` join table.

### `muscles`
| Column | Type | Notes |
|--------|------|-------|
| id | text PK | e.g. `anterior_deltoid` |
| display_name | text | e.g. "Anterior Deltoid" |
| group_name | text | e.g. "shoulders", "back" |
| region | enum `muscle_region` | upper, lower, core |
| movement_type | enum `muscle_movement_type` | push, pull, neutral, abduction |
| created_at, updated_at | timestamptz | auto |

### `exercise_muscles`
| Column | Type | Notes |
|--------|------|-------|
| exercise_id | text FK → exercises | composite PK with muscle_id |
| muscle_id | text FK → muscles | composite PK with exercise_id |
| role | enum `muscle_role` | prime, synergist, stabilizer (default: synergist) |
| contribution | numeric NOT NULL | 0–1 activation weight (default: 0.5) |
| created_at, updated_at | timestamptz | auto |

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK FK → auth.users | |
| username | text | unique, CHECK length ≥ 3 |
| full_name | text | nullable |
| avatar_url | text | nullable |
| website | text | nullable |
| created_at, updated_at | timestamptz | |

## RLS notes

- `programs`, `program_blocks`, `program_weeks`, `program_days`, `workout_exercise_groups`, `workout_exercises`, `exercise_sets` — RLS enabled; policies scope to `auth.uid()`.
- `exercises`, `muscles`, `exercise_muscles` — RLS disabled (public read).
- `profiles` — RLS enabled.
- The `clone_program_from_template` RPC is `SECURITY DEFINER` and uses `auth.uid()` to set the cloned program's `user_id`.

## Enums

| Enum | Values |
|------|--------|
| `day_type` | workout, rest, active_rest, other |
| `group_type` | standard, superset, giant_set, circuit |
| `intensity_system` | rpe, one_rep_max_percent, rir, none |
| `muscle_movement_type` | push, pull, neutral, abduction |
| `muscle_region` | upper, lower, core |
| `muscle_role` | prime, synergist, stabilizer |
| `program_goal` | strength, hypertrophy, endurance, power |
| `program_mode` | days, blocks |
| `set_type` | warmup, standard, amrap, drop, cluster, myo_reps, rest_pause, top_set, backoff, other |

## Design decisions

### Single source of truth for muscle metadata

The `muscles` table is the authoritative source for muscle definitions, including `region` and `movement_type`. The client-side `constants/muscles.ts` file mirrors this data for offline use and body-highlighter mapping, but all analytics and volume calculations should derive from the database values embedded in `exercise_muscles → muscles` joins.

### `exercise_muscles.contribution` is NOT NULL

`contribution` defaults to `0.5` and is always present. Code should never need a fallback — this eliminates inconsistencies where different code paths used different defaults (`0` vs `0.5`).

### `exercise_muscles.role` classifies muscle involvement

Each exercise–muscle relationship has a `role` (prime, synergist, stabilizer) enabling finer-grained analysis than contribution alone. For example, filtering exercises by primary mover vs stabilizer load.
