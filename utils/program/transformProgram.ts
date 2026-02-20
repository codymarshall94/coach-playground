import type { Program, SetInfo } from "@/types/Workout";

// ---------------------------------------------------------------------------
// Transform Supabase program response → application Program type
// ---------------------------------------------------------------------------

/** Unpack `params` JSONB column into top-level SetInfo fields. */
function transformSets(sets: Record<string, unknown>[]): SetInfo[] {
  return sets.map((s) => {
    const { params, ...rest } = s;
    return {
      ...rest,
      ...(params && typeof params === "object" ? params : {}),
    } as SetInfo;
  });
}

/** Transform exercise groups, applying sensible intensity defaults per exercise. */
function transformGroups(groups: Record<string, unknown>[]) {
  return (
    groups?.map((g: Record<string, unknown>) => ({
      ...g,
      exercises: (g.exercises as Record<string, unknown>[] | undefined)?.map(
        (ex: Record<string, unknown>) => {
          const sets = transformSets(
            (ex.sets as Record<string, unknown>[]) ?? []
          );

          const normalized = sets.map((s) => {
            // Default rest to 60s when null/undefined/0 (0 is not a valid option)
            const withRest = { ...s, rest: s.rest || 60 };
            const intensity = ex.intensity as string | undefined;

            if (intensity === "rpe") {
              return {
                ...withRest,
                rpe: withRest.rpe ?? 8,
                rir: null,
                one_rep_max_percent: null,
              };
            }
            if (intensity === "one_rep_max_percent") {
              return {
                ...withRest,
                one_rep_max_percent: withRest.one_rep_max_percent ?? 75,
                rpe: null,
                rir: null,
              };
            }
            if (intensity === "rir") {
              return {
                ...withRest,
                rir: withRest.rir ?? 2,
                rpe: null,
                one_rep_max_percent: null,
              };
            }

            return withRest;
          });

          return { ...ex, sets: normalized };
        }
      ),
    })) ?? []
  );
}

function transformDays(days: Record<string, unknown>[]) {
  return (
    days?.map((d: Record<string, unknown>) => ({
      ...d,
      groups: transformGroups(
        (d.groups as Record<string, unknown>[]) ?? []
      ),
    })) ?? []
  );
}

export function transformProgramFromSupabase(data: Record<string, unknown>): Program {
  const transformed = {
    ...data,
    days: transformDays((data.days as Record<string, unknown>[]) ?? []),
    blocks:
      (data.blocks as Record<string, unknown>[] | undefined)?.map(
        (b: Record<string, unknown>) => {
          // `b.weeks` is the embedded program_weeks array from PostgREST.
          // (The old integer column was renamed to `week_count` so there is
          //  no collision — `b.weeks` is always an array.)
          const weeksArr = b.weeks as Record<string, unknown>[] | undefined;
          const hasWeeks = Array.isArray(weeksArr) && weeksArr.length > 0;

          let weeks: Record<string, unknown>[];
          if (hasWeeks) {
            weeks = weeksArr
              .sort(
                (a, b2) =>
                  ((a.order_num as number) ?? 0) -
                  ((b2.order_num as number) ?? 0)
              )
              .map((w) => ({
                id: w.id,
                weekNumber: w.week_number ?? (w as Record<string, unknown>).weekNumber ?? 1,
                label: w.label ?? `Week ${w.week_number ?? 1}`,
                days: transformDays(
                  (w.days as Record<string, unknown>[]) ?? []
                ),
              }));
          } else {
            // Pre-migration block with no program_weeks rows — synthesize
            // a single week from whatever days are available on the block.
            const fallbackDays = transformDays(
              (b.days as Record<string, unknown>[]) ?? []
            );
            weeks = [
              {
                id: crypto.randomUUID(),
                weekNumber: 1,
                label: "Week 1",
                days: fallbackDays,
              },
            ];
          }

          const allDays = weeks.flatMap(
            (w) => w.days as Record<string, unknown>[]
          );

          return { ...b, days: allDays, weeks, weekCount: weeks.length };
        }
      ) ?? [],
  } as Program;

  return transformed;
}
