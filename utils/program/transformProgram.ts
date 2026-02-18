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
        const days = transformDays(b.days ?? []);
        // Convert DB weeks (number) → weeks array structure
        const dbWeekCount = typeof b.weeks === "number" ? b.weeks : 1;
        const weeks = Array.isArray(b.weeks)
          ? b.weeks  // already in new format (shouldn't happen from DB, but defensive)
          : [{
              id: crypto.randomUUID(),
              weekNumber: 1,
              label: "Week 1",
              days,
            }];
        return {
          ...b,
          days,
          weeks,
          weekCount: dbWeekCount,
        };
      }) ?? [],
  } as Program;
  return transformed;
}
