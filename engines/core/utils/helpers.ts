// --- inline helpers: build ProgramSpec and SessionInput[] from your data ---

import type {
  ProgramSpec,
  SessionExercise,
  SessionInput,
  SetInfo,
} from "@/engines/main";
import { resolveWeeklyTargets } from "@/engines/program/profiles";
import type { Exercise } from "@/types/Exercise";
import type {
  Program,
  ProgramDay,
  WorkoutExerciseGroup,
} from "@/types/Workout";

// build ProgramSpec from your Program shape (no blocks required)
export function buildSpecFromProgram(p: Program): ProgramSpec {
  const spec: ProgramSpec = {
    goal: (p.goal as any) ?? "hypertrophy",
  };
  // fill defaults from profile if user didn't set targets
  const t = resolveWeeklyTargets(spec);
  if (t) spec.targets = t;

  return spec;
}

// convert your day → SessionInput (inline, minimal)
export function toSessionInput(
  day: ProgramDay,
  index: number,
  allExercises: Exercise[]
): SessionInput {
  const groups: WorkoutExerciseGroup[] = day.groups ?? [];

  const exercises: SessionExercise[] = groups.map((g, gi) => {
    const first = g.exercises[0];
    const meta = allExercises.find((e) => e.id === first?.exercise_id);

    const sets: SetInfo[] = (first?.sets ?? []).map((s) => ({
      reps: s.reps ?? 0,
      rest: s.rest ?? 90,
      rpe: s.rpe ?? null,
      one_rep_max_percent: s.one_rep_max_percent ?? null,
      set_type: (s.set_type as SetInfo["set_type"]) || "standard",
    }));

    return {
      exercise: {
        id: first?.exercise_id ?? `ex-${gi}`,
        name: meta?.name ?? first?.display_name ?? "Exercise",
        category: meta?.category ?? "other", // empty ok
        movement_plane: meta?.movement_plane ?? "sagittal", // empty ok
        load_profile: meta?.load_profile ?? "axial",
        exercise_muscles: meta?.exercise_muscles ?? null,
        axial_load: meta?.load_profile ?? "axial",
        is_main_lift: gi === 0, // first group treated as main
        aliases: meta?.aliases ?? [],
        equipment: meta?.equipment ?? [],
        skill_requirement: meta?.skill_requirement ?? "low",
        compound: meta?.compound ?? false,
        image_url: meta?.image_url ?? "",
        unilateral: meta?.unilateral ?? false,
        ballistic: meta?.ballistic ?? false,
        rom_rating: meta?.rom_rating ?? "medium",
        force_curve: meta?.force_curve ?? "bell",
        ideal_rep_range: meta?.ideal_rep_range ?? [8, 12],
        intensity_ceiling: meta?.intensity_ceiling ?? 0.8,
        fatigue_index: meta?.fatigue_index ?? 0.5,
        cns_demand: meta?.cns_demand ?? 0.5,
        metabolic_demand: meta?.metabolic_demand ?? 0.5,
        joint_stress: meta?.joint_stress ?? 0.5,
        recovery_days: meta?.recovery_days ?? 1,
        base_calorie_cost: meta?.base_calorie_cost ?? 10,
        energy_system: meta?.energy_system ?? "Glycolytic",
        volume_per_set: meta?.volume_per_set ?? { strength: 1, hypertrophy: 1 },
        cues: meta?.cues ?? [],
        contra_indications: meta?.contra_indications ?? [],
        external_links: meta?.external_links ?? [],
        tracking_type: meta?.tracking_type ?? ["reps"],
      },
      sets,
      order: gi + 1,
    };
  });

  return {
    sessionId: day.id,
    slotIndex: index,
    exercises,
  };
}

export function buildSequence(
  program: Program,
  allExercises: Exercise[]
): SessionInput[] {
  const days: ProgramDay[] = program.days ?? program.blocks?.[0]?.days ?? [];
  return days.map((d, i) => toSessionInput(d, i, allExercises));
}
