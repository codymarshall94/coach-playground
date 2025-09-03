import type { Exercise, Equipment, SkillRequirement } from "@/types/Exercise";

export function normalize(s?: string) {
  return (s ?? "").toLowerCase().trim();
}

export function tokenize(q: string) {
  return normalize(q).split(/\s+/).filter(Boolean);
}

type FilterBag = {
  categories: string[];
  muscleIds: string[];
  traits: Array<"compound" | "unilateral" | "ballistic">;
  equipment: Equipment[];
  skill?: SkillRequirement;
  limits: {
    fatigue: number | null;
    cns: number | null;
    metabolic: number | null;
    joint: number | null;
  };
  tokens: string[];
};

export function exerciseMatchesFiltersAndSearch(
  e: Exercise,
  f: FilterBag
): boolean {
  // categories (Exercise.category is a single enum)
  if (f.categories.length && !f.categories.includes(e.category)) return false;

  // equipment (Exercise.equipment is string[])
  if (f.equipment.length) {
    const equipSet = new Set(e.equipment ?? []);
    const ok = f.equipment.some((eq) => equipSet.has(eq));
    if (!ok) return false;
  }

  // skill requirement
  if (f.skill && e.skill_requirement !== f.skill) return false;

  // traits (all selected trait flags must be true on exercise)
  for (const t of f.traits) {
    if (!Boolean((e as any)[t])) return false;
  }

  // muscles: match if *any* of the selected ids is present
  if (f.muscleIds.length) {
    const ids = new Set(
      (e.exercise_muscles ?? []).map((row) => row.muscles.id)
    );
    const ok = f.muscleIds.some((id) => ids.has(id));
    if (!ok) return false;
  }

  // numeric limits (≤)
  if (f.limits.fatigue !== null && e.fatigue_index > f.limits.fatigue)
    return false;
  if (f.limits.cns !== null && e.cns_demand > f.limits.cns) return false;
  if (f.limits.metabolic !== null && e.metabolic_demand > f.limits.metabolic)
    return false;
  if (f.limits.joint !== null && e.joint_stress > f.limits.joint) return false;

  // search tokens
  if (f.tokens.length === 0) return true;

  const hay = [
    e.name,
    ...(e.aliases ?? []),
    e.category,
    e.movement_plane,
    e.load_profile,
    e.skill_requirement,
    ...(e.equipment ?? []),
    ...(e.exercise_muscles?.map((m) => m.muscles.display_name) ?? []),
  ]
    .filter(Boolean)
    .map(normalize)
    .join(" ");

  return f.tokens.every((t) => hay.includes(t));
}

// --- Sorting / Ranking ---

export function rankAndSort(
  items: Exercise[],
  sortKey:
    | "relevance"
    | "alpha"
    | "fatigue_asc"
    | "fatigue_desc"
    | "cns_desc"
    | "metabolic_desc"
    | "joint_desc",
  tokens: string[]
) {
  if (sortKey === "alpha") {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortKey === "fatigue_asc") {
    return [...items].sort(
      (a, b) => (a.fatigue_index ?? 0) - (b.fatigue_index ?? 0)
    );
  }
  if (sortKey === "fatigue_desc") {
    return [...items].sort(
      (a, b) => (b.fatigue_index ?? 0) - (a.fatigue_index ?? 0)
    );
  }
  if (sortKey === "cns_desc") {
    return [...items].sort((a, b) => (b.cns_demand ?? 0) - (a.cns_demand ?? 0));
  }
  if (sortKey === "metabolic_desc") {
    return [...items].sort(
      (a, b) => (b.metabolic_demand ?? 0) - (a.metabolic_demand ?? 0)
    );
  }
  if (sortKey === "joint_desc") {
    return [...items].sort(
      (a, b) => (b.joint_stress ?? 0) - (a.joint_stress ?? 0)
    );
  }

  // "relevance" default: simple token coverage + light boosts
  const score = (e: Exercise) => {
    let s = 0;
    const name = normalize(e.name);
    const hay = [
      e.name,
      ...(e.aliases ?? []),
      e.category,
      e.movement_plane,
      e.load_profile,
      e.skill_requirement,
      ...(e.equipment ?? []),
    ]
      .filter(Boolean)
      .map(normalize)
      .join(" ");

    // coverage
    s += tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);

    // name bonus if tokens are in the name
    if (tokens.length && tokens.every((t) => name.includes(t))) s += 2;

    // prefer "simpler" exercises slightly when equal
    s +=
      (1 -
        (e.skill_requirement === "high"
          ? 1
          : e.skill_requirement === "moderate"
          ? 0.5
          : 0.25)) *
      0.25;

    return s;
  };

  return [...items].sort((a, b) => {
    const diff = score(b) - score(a);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });
}

// --- Grouping ---

export function buildGroupedByCategory(list: Exercise[]) {
  return list.reduce<Record<string, Exercise[]>>((acc, e) => {
    const key = e.category ?? "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});
}
