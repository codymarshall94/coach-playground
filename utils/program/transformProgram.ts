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
          const intensity = ex.intensity;
          if (intensity === "rpe") {
            return {
              ...s,
              rpe: s.rpe ?? 8,
              rir: s.rir ?? null,
              one_rep_max_percent: s.one_rep_max_percent ?? null,
            };
          }
          if (intensity === "one_rep_max_percent") {
            return {
              ...s,
              one_rep_max_percent: s.one_rep_max_percent ?? 75,
              rpe: s.rpe ?? null,
              rir: s.rir ?? null,
            };
          }
          if (intensity === "rir") {
            return {
              ...s,
              rir: s.rir ?? 2,
              rpe: s.rpe ?? null,
              one_rep_max_percent: s.one_rep_max_percent ?? null,
            };
          }

          return s;
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
  return {
    ...data,
    days: transformDays(data.days ?? []),
    blocks:
      data.blocks?.map((b: any) => ({
        ...b,
        days: transformDays(b.days ?? []),
      })) ?? [],
  } as Program;
}
