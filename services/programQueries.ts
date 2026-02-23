// services/programQueries.ts
// Shared Supabase PostgREST select strings for program queries.
// Single source of truth — every caller imports from here.

/**
 * Full nested select for loading a single program with all children.
 * Used by: getProgramById, SSR builder page, SSR [id] page, template full fetch.
 *
 * IMPORTANT — The top-level `days` embedding loads every `program_days` row
 * matching `program_id`, which **includes** days that belong to blocks.
 * Block-mode days are already fetched through blocks → weeks → days, so the
 * top-level branch would duplicate the *entire* nested graph (groups →
 * exercises → sets) and can cause a Supabase statement timeout on large
 * programs.
 *
 * Every callsite MUST chain `.is("days.block_id", null)` on the query to
 * scope the top-level `days` to days-mode-only rows.  A convenience helper
 * {@link applyDetailDaysFilter} is provided for this.
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
 * Apply the required embedded-resource filter so the top-level `days`
 * only returns days-mode rows (block_id IS NULL).  Block-mode days are
 * already returned through the blocks → weeks → days path.
 *
 * Usage:
 * ```ts
 * const query = supabase.from("programs").select(PROGRAM_DETAIL_SELECT).eq("id", id);
 * const { data } = await applyDetailDaysFilter(query).single();
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyDetailDaysFilter<T extends { is: (...args: any[]) => any }>(
  query: T
): T {
  return query.is("days.block_id", null);
}

/**
 * Lightweight select for the program list / index view.
 * Only fetches IDs of nested rows so we can count days.
 */
export const PROGRAM_INDEX_SELECT = `
  id, name, description, goal, mode, cover_image, created_at, updated_at,
  is_published, price, currency, published_at, published_version_id, pdf_config,
  blocks:program_blocks (
    id,
    weeks:program_weeks (
      id,
      days:program_days ( id )
    )
  ),
  days:program_days ( id )
` as const;
