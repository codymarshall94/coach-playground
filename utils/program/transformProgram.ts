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
      exercises: g.exercises?.map((ex: any) => ({
        ...ex,
        sets: transformSets(ex.sets ?? []),
      })),
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
