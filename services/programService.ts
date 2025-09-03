// services/programs.ts
// Fast, batched Supabase service layer for Programs/Blocks/Days/Groups/Exercises/Sets.
// - Single shared client
// - Batch inserts per level
// - Return only necessary columns
// - Clear, typed helpers
// - Minimal selects for performance

import {
  Program,
  ProgramBlock,
  ProgramDay,
  SetInfo,
  WorkoutExercise,
} from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

/* ----------------------------------------------------------------------------
 * Supabase client (single instance per module import)
 * -------------------------------------------------------------------------- */

const supabase = createClient();

/* ----------------------------------------------------------------------------
 * Small helpers
 * -------------------------------------------------------------------------- */

const nowIso = () => new Date().toISOString();

/** Map rows with an `order_num` so we can align returned rows to input order. */
function byOrder<T extends { order_num: number }>(rows: T[]) {
  return new Map(rows.map((r) => [r.order_num, r]));
}

/** Safe getter for nested arrays */
const arr = <T>(x: T[] | undefined | null): T[] => (Array.isArray(x) ? x : []);

/* ----------------------------------------------------------------------------
 * Inserts (minimal columns only)
 * -------------------------------------------------------------------------- */

/** Insert blocks (batched). Returns ids mapped to order. */
export async function insertProgramBlocks(
  programId: string,
  blocks: ProgramBlock[]
) {
  const payload = blocks.map((b, index) => ({
    program_id: programId,
    name: b.name,
    description: b.description,
    order_num: index,
    weeks: b.weeks ?? 4, // defensive default
  }));

  const { data, error } = await supabase
    .from("program_blocks")
    .insert(payload)
    .select("id,order_num");

  if (error) throw new Error(`insertProgramBlocks: ${error.message}`);
  return data as Array<{ id: string; order_num: number }>;
}

/** Insert days (batched). Returns ids mapped to order. */
export async function insertProgramDays(
  programId: string,
  days: ProgramDay[],
  blockId?: string
) {
  const payload = days.map((d, index) => ({
    program_id: programId,
    block_id: blockId ?? null,
    name: d.name,
    description: d.description,
    order_num: index,
    type: d.type,
  }));

  const { data, error } = await supabase
    .from("program_days")
    .insert(payload)
    .select("id,order_num");

  if (error) throw new Error(`insertProgramDays: ${error.message}`);
  return data as Array<{ id: string; order_num: number }>;
}

/** Insert groups for a day. Returns id + order for alignment. */
export async function insertWorkoutExerciseGroups(
  dayId: string,
  groups: Array<{
    type: string;
    notes?: string;
    rest_after_group?: number;
    exercises: WorkoutExercise[];
  }>
) {
  const payload = groups.map((g, gi) => ({
    program_day_id: dayId,
    order_num: gi,
    type: g.type,
    notes: g.notes ?? "",
    rest_after_group: g.rest_after_group ?? null,
  }));

  const { data, error } = await supabase
    .from("workout_exercise_groups")
    .insert(payload)
    .select("id,order_num");

  if (error) throw new Error(`insertWorkoutExerciseGroups: ${error.message}`);
  return data as Array<{ id: string; order_num: number }>;
}

/** Insert exercises for ONE group (batched). Returns id + order for alignment. */
export async function insertWorkoutExercises(
  groupId: string,
  exercises: WorkoutExercise[]
) {
  const payload = exercises.map((ex, index) => ({
    workout_group_id: groupId,
    exercise_id: ex.exercise_id,
    display_name: ex.display_name,
    intensity: ex.intensity,
    notes: ex.notes ?? "",
    order_num: index,
  }));

  const { data, error } = await supabase
    .from("workout_exercises")
    .insert(payload)
    .select("id,order_num,workout_group_id");

  if (error) throw new Error(`insertWorkoutExercises: ${error.message}`);
  return data as Array<{
    id: string;
    order_num: number;
    workout_group_id: string;
  }>;
}

/** Insert SETS for MANY exercises in one call (best perf). */
export async function insertExerciseSetsBulk(
  items: Array<{ workoutExerciseId: string; sets: SetInfo[] }>
) {
  const payload = items.flatMap(({ workoutExerciseId, sets }) =>
    sets.map((set, index) => ({
      workout_exercise_id: workoutExerciseId,
      set_index: index,
      set_type: set.set_type ?? "standard",
      reps: set.reps,
      rest: set.rest,
      rpe: set.rpe ?? null,
      rir: set.rir ?? null,
      one_rep_max_percent: set.one_rep_max_percent ?? null,
      notes: set.notes ?? null,
      params: {}, // optional JSON blob for advanced set params
    }))
  );

  if (payload.length === 0) return;

  const { error } = await supabase.from("exercise_sets").insert(payload);

  if (error) throw new Error(`insertExerciseSetsBulk: ${error.message}`);
}

/* ----------------------------------------------------------------------------
 * Top-level save/update flow
 * -------------------------------------------------------------------------- */

export async function saveOrUpdateProgramService(program: Program) {
  const programId = await ensureProgramRecord(program);

  await clearProgramChildren(programId, program.mode);

  await insertProgramStructure(programId, program);

  return programId;
}

/* ----------------------------------------------------------------------------
 * Ensure + update Program row
 * -------------------------------------------------------------------------- */

export async function doesProgramExist(programId: string) {
  const { data, error } = await supabase
    .from("programs")
    .select("id")
    .eq("id", programId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("❌ doesProgramExist:", error.message);
  }
  return !!data;
}

export async function ensureProgramRecord(program: Program): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error("Not authenticated");

  const isNew = !(await doesProgramExist(program.id));

  if (isNew) {
    const { data, error } = await insertProgram({
      user_id: user.id,
      name: program.name,
      description: program.description,
      goal: program.goal,
      mode: program.mode,
    });
    if (error || !data) {
      console.error("❌ insertProgram:", error?.message);
      throw new Error(error?.message || "Failed to create program");
    }
    return data.id;
  } else {
    const { error } = await updateProgram(program);
    if (error) {
      console.error("❌ updateProgram:", error.message);
      throw new Error(error.message);
    }
    return program.id;
  }
}

/* ----------------------------------------------------------------------------
 * Clearing children
 * -------------------------------------------------------------------------- */

export async function clearProgramChildren(
  programId: string,
  mode: Program["mode"]
) {
  if (mode === "blocks") {
    const { error } = await supabase
      .from("program_blocks")
      .delete()
      .eq("program_id", programId);
    if (error) console.error("❌ clearProgramChildren blocks:", error.message);
  } else {
    const { error } = await supabase
      .from("program_days")
      .delete()
      .eq("program_id", programId);
    if (error) console.error("❌ clearProgramChildren days:", error.message);
  }
}

/* ----------------------------------------------------------------------------
 * Insert full structure
 * -------------------------------------------------------------------------- */

export async function insertProgramStructure(
  programId: string,
  program: Program
) {
  if (program.mode === "days" && program.days?.length) {
    const daysInserted = await insertProgramDays(programId, program.days);
    await insertDaysWithGroups(daysInserted, program.days);
  }

  if (program.mode === "blocks" && program.blocks?.length) {
    const blocksInserted = await insertProgramBlocks(programId, program.blocks);
    const blocksByOrd = byOrder(blocksInserted);

    for (let bIndex = 0; bIndex < program.blocks.length; bIndex++) {
      const block = program.blocks[bIndex];
      const insertedBlock = blocksByOrd.get(bIndex);
      if (!insertedBlock) continue;

      const daysInserted = await insertProgramDays(
        programId,
        block.days,
        insertedBlock.id
      );
      await insertDaysWithGroups(daysInserted, block.days);
    }
  }
}

/* ----------------------------------------------------------------------------
 * Day => Groups => Exercises => Sets
 * -------------------------------------------------------------------------- */

export async function insertDaysWithGroups(
  insertedDays: Array<{ id: string; order_num: number }>,
  originalDays: ProgramDay[]
) {
  const dayByOrd = byOrder(insertedDays);
  const dayErrors: Array<{ dayIndex: number; where: string; message: string }> =
    [];

  for (let i = 0; i < originalDays.length; i++) {
    const srcDay = originalDays[i];
    const dstDay = dayByOrd.get(i);
    if (!dstDay) continue;

    const groups = arr(srcDay?.groups);
    if (!groups.length) continue;

    try {
      // 1) groups
      const groupRows = await insertWorkoutExerciseGroups(dstDay.id, groups);
      const groupsByOrd = byOrder(groupRows);

      // 2) exercises + collect sets
      type InsertedExercise = {
        id: string;
        order_num: number;
        group_index: number;
      };
      const insertedExercises: InsertedExercise[] = [];

      for (let gi = 0; gi < groups.length; gi++) {
        const insertedGroup = groupsByOrd.get(gi);
        if (!insertedGroup) continue;

        const exs = arr(groups[gi].exercises);
        if (!exs.length) continue;

        try {
          const exRows = await insertWorkoutExercises(insertedGroup.id, exs);
          exRows.forEach((r) =>
            insertedExercises.push({
              id: r.id,
              order_num: r.order_num,
              group_index: gi,
            })
          );
        } catch (e: any) {
          dayErrors.push({
            dayIndex: i,
            where: `exercises[g${gi}]`,
            message: e?.message ?? String(e),
          });
        }
      }

      // 3) sets (bulk)
      const setsForBulk = insertedExercises.map(
        ({ id, order_num, group_index }) => {
          const originalSets = arr(
            groups[group_index]?.exercises?.[order_num]?.sets
          );
          return { workoutExerciseId: id, sets: originalSets };
        }
      );

      try {
        await insertExerciseSetsBulk(setsForBulk);
      } catch (e: any) {
        dayErrors.push({
          dayIndex: i,
          where: "sets",
          message: e?.message ?? String(e),
        });
      }
    } catch (e: any) {
      dayErrors.push({
        dayIndex: i,
        where: "groups",
        message: e?.message ?? String(e),
      });
    }
  }

  if (dayErrors.length) {
    console.table(dayErrors);
    const days = [...new Set(dayErrors.map((d) => d.dayIndex))].length;
    throw new Error(`insertDaysWithGroups failed for ${days} day(s)`);
  }
}

/* ----------------------------------------------------------------------------
 * Program CRUD (row)
 * -------------------------------------------------------------------------- */

export async function insertProgram({
  user_id,
  name,
  description,
  goal,
  mode,
}: {
  user_id: string;
  name: string;
  description: string;
  goal: string;
  mode: "days" | "blocks";
}) {
  return supabase
    .from("programs")
    .insert({ user_id, name, description, goal, mode })
    .select("id")
    .single();
}

export async function updateProgram(program: Program) {
  return supabase
    .from("programs")
    .update({
      name: program.name,
      description: program.description,
      goal: program.goal,
      mode: program.mode,
      updated_at: nowIso(),
    })
    .eq("id", program.id);
}

/* ----------------------------------------------------------------------------
 * Query APIs
 * -------------------------------------------------------------------------- */

type ProgramIndex = {
  id: string;
  name: string;
  description: string;
  goal: Program["goal"];
  mode: Program["mode"];
  created_at: string | null;
  updated_at: string | null;
  blocks: Array<{ id: string; days: Array<{ id: string }> }>;
  days: Array<{ id: string }>;
};

export async function getAllProgramsForUser(): Promise<Program[]> {
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      id, name, description, goal, mode, created_at, updated_at,
      blocks:program_blocks (
        id,
        days:program_days ( id )
      ),
      days:program_days ( id )
    `
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ getAllProgramsForUser:", error.message);
    throw error;
  }

  const mapped =
    (data as ProgramIndex[] | null)?.map((p) => ({
      ...p,
      created_at: p.created_at ? new Date(p.created_at) : null,
      updated_at: p.updated_at ? new Date(p.updated_at) : null,
    })) ?? [];

  return mapped as unknown as Program[];
}

export async function getProgramById(id: string): Promise<Program | null> {
  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      blocks:program_blocks (
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
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ getProgramById:", error.message);
    throw error;
  }

  return data as Program;
}
