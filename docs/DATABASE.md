# PRGRM — Database Schema

All tables live in the `public` schema on Supabase (Postgres). RLS is enabled on user-owned tables.

## Table overview

```
programs
 ├── program_blocks        (optional, block-mode only)
 │    └── program_days
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
| weeks | int | default 4, CHECK ≥ 1 |
| order_num | int | positional |

### `program_days`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| program_id | uuid FK → programs | |
| block_id | uuid FK → program_blocks | nullable (day-mode) |
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

### `exercises`
Reference table with rich metadata. Key columns: `id` (text PK), `name`, `category`, `equipment[]`, `activation_map` (jsonb), `compound`, `unilateral`, `cns_demand`, `fatigue_index`, `joint_stress`, `metabolic_demand`, `energy_system`, `ideal_rep_range[]`, `volume_per_set` (jsonb).

### `muscles`
Lookup: `id` (text PK), `display_name`, `group_name`.

### `exercise_muscles`
Join table: `exercise_id` FK → exercises, `muscle_id` FK → muscles, `contribution` (numeric).

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

- `programs`, `program_blocks`, `program_days`, `workout_exercise_groups`, `workout_exercises`, `exercise_sets` — RLS enabled; policies scope to `auth.uid()`.
- `exercises`, `muscles`, `exercise_muscles` — RLS disabled (public read).
- `profiles` — RLS enabled.
- The `clone_program_from_template` RPC is `SECURITY DEFINER` and uses `auth.uid()` to set the cloned program's `user_id`.
