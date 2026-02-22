// services/programQueries.ts
// Shared Supabase PostgREST select strings for program queries.
// Single source of truth — every caller imports from here.

/**
 * Full nested select for loading a single program with all children.
 * Used by: getProgramById, SSR builder page, SSR [id] page, template full fetch.
 */
export const PROGRAM_DETAIL_SELECT = `
  *,
  blocks:program_blocks (
    *,
    weeks:program_weeks (
      *,
      days:program_days (
        *,
        groups:workout_exercise_groups (
          *,
          exercises:workout_exercises (
            *,
            sets:exercise_sets (*)
          )
        )
      )
    )
  ),
  days:program_days (
    *,
    groups:workout_exercise_groups (
      *,
      exercises:workout_exercises (
        *,
        sets:exercise_sets (*)
      )
    )
  )
` as const;

/**
 * Lightweight select for the program list / index view.
 * Only fetches IDs of nested rows so we can count days.
 */
export const PROGRAM_INDEX_SELECT = `
  id, name, description, goal, mode, cover_image, created_at, updated_at,
  is_published, price, currency, published_at, published_version_id,
  blocks:program_blocks (
    id,
    weeks:program_weeks (
      id,
      days:program_days ( id )
    )
  ),
  days:program_days ( id )
` as const;
