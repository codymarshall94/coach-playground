import type { Program, SetInfo } from "@/types/Workout";

// ---------------------------------------------------------------------------
// Transform Supabase program response → application Program type
// Unpacks `params` JSONB into top-level SetInfo fields after fetch.
// ---------------------------------------------------------------------------

function transformSets(sets: any[]): SetInfo[] {
  return sets.map((s) => {
    const { params, ...rest } = s;
    return {
      ...rest,
      ...(params && typeof params === "object" ? params : {}),
    } as SetInfo;
  });
}

function transformGroups(groups: any[]) {
  return (
    groups?.map((g: any) => ({
      ...g,
      exercises: g.exercises?.map((ex: any) => {
        const sets = transformSets(ex.sets ?? []);

        // Ensure each set has a sensible default for the exercise's intensity
        const normalized = sets.map((s: any) => {
          // Default rest to 60s when null/undefined/0 (0 is not a valid option)
          const withRest = { ...s, rest: s.rest || 60 };
          const intensity = ex.intensity;
          if (intensity === "rpe") {
            return {
              ...withRest,
              rpe: withRest.rpe ?? 8,
              rir: withRest.rir ?? null,
              one_rep_max_percent: withRest.one_rep_max_percent ?? null,
            };
          }
          if (intensity === "one_rep_max_percent") {
            return {
              ...withRest,
              one_rep_max_percent: withRest.one_rep_max_percent ?? 75,
              rpe: withRest.rpe ?? null,
              rir: withRest.rir ?? null,
            };
          }
          if (intensity === "rir") {
            return {
              ...withRest,
              rir: withRest.rir ?? 2,
              rpe: withRest.rpe ?? null,
              one_rep_max_percent: withRest.one_rep_max_percent ?? null,
            };
          }

          return withRest;
        });

        return {
          ...ex,
          sets: normalized,
        };
      }),
    })) ?? []
  );
}

function transformDays(days: any[]) {
  return (
    days?.map((d: any) => ({
      ...d,
      groups: transformGroups(d.groups ?? []),
    })) ?? []
  );
}

export function transformProgramFromSupabase(data: any): Program {
  const transformed = {
    ...data,
    days: transformDays(data.days ?? []),
    blocks:
      data.blocks?.map((b: any) => {
        // `b.weeks` from the new query is an array of week rows with nested days.
        // Legacy fallback: if `b.weeks` is a number (old int column), synthesize.
        const hasWeeksTable = Array.isArray(b.weeks);

        let weeks: any[];
        if (hasWeeksTable && b.weeks.length > 0) {
          // New format: weeks rows from program_weeks table, each with nested days
          weeks = b.weeks
            .sort((a: any, b2: any) => (a.order_num ?? 0) - (b2.order_num ?? 0))
            .map((w: any) => ({
              id: w.id,
              weekNumber: w.week_number ?? w.weekNumber ?? 1,
              label: w.label ?? `Week ${w.week_number ?? 1}`,
              days: transformDays(w.days ?? []),
            }));
        } else {
          // Legacy block: no weeks rows — synthesize a single week from block.days
          const fallbackDays = transformDays(b.days ?? []);
          weeks = [{
            id: crypto.randomUUID(),
            weekNumber: 1,
            label: "Week 1",
            days: fallbackDays,
          }];
        }

        // block.days = union of all weeks' days (backward compat)
        const allDays = weeks.flatMap((w: any) => w.days);

        return {
          ...b,
          days: allDays,
          weeks,
          weekCount: weeks.length,
        };
      }) ?? [],
  } as Program;
  return transformed;
}
