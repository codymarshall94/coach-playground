import {
  Program,
  ProgramBlock,
  ProgramDay,
  SetInfo,
  WorkoutExercise,
} from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

/* ---------------------------------------------------------------------------- */

export async function insertWorkout(dayId: string) {
  const supabase = createClient();

  return supabase.from("workouts").insert({ day_id: dayId }).select().single();
}

export async function insertProgramBlocks(
  programId: string,
  blocks: ProgramBlock[]
) {
  const supabase = createClient();

  const payload = blocks.map((block, index) => ({
    program_id: programId,
    name: block.name,
    description: block.description,
    order_num: index,
    weeks: block.weeks ?? 4, // <-- safeguard
  }));

  return supabase.from("program_blocks").insert(payload).select();
}

export async function insertDaysWithWorkouts(
  insertedDays: ProgramDay[],
  originalDays: ProgramDay[]
) {
  const supabase = createClient();
  let failureCount = 0;

  for (let i = 0; i < insertedDays.length; i++) {
    const insertedDay = insertedDays[i];
    const originalDay = originalDays[i];
    const workout = originalDay.workout?.[0];

    if (
      !workout ||
      !Array.isArray(workout.exercise_groups) ||
      workout.exercise_groups.length === 0
    ) {
      continue;
    }

    const { data: workoutData, error: workoutError } = await insertWorkout(
      insertedDay.id
    );
    if (workoutError || !workoutData) {
      failureCount++;
      continue;
    }

    for (
      let groupIndex = 0;
      groupIndex < workout.exercise_groups.length;
      groupIndex++
    ) {
      const group = workout.exercise_groups[groupIndex];

      const { data: groupData, error: groupError } = await supabase
        .from("workout_exercise_groups")
        .insert({
          workout_id: workoutData.id,
          order_num: groupIndex,
          type: group.type,
          notes: group.notes ?? "",
          rest_after_group: group.rest_after_group ?? null,
        })
        .select()
        .single();

      if (groupError || !groupData) {
        failureCount++;
        continue;
      }

      const { data: insertedExercises, error: exerciseError } =
        await insertWorkoutExercises(groupData.id, group.exercises);

      if (exerciseError || !insertedExercises?.length) {
        failureCount++;
        continue;
      }

      for (let i = 0; i < insertedExercises.length; i++) {
        const setData = await insertExerciseSets(
          insertedExercises[i].id,
          group.exercises[i].sets
        );
        if (!setData) {
          failureCount++;
        }
      }
    }
  }

  if (failureCount > 0) {
    throw new Error(`insertDaysWithWorkouts failed for ${failureCount} day(s)`);
  }
}

/* ---------------------------------------------------------------------------- */

export async function saveOrUpdateProgramService(program: Program) {
  const programId = await ensureProgramRecord(program);

  await clearProgramChildren(programId, program.mode);

  await insertProgramStructure(programId, program);

  return programId;
}

/* ---------------------------------------------------------------------------- */

export async function doesProgramExist(programId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("❌ doesProgramExist error", error.message);
  }

  const exists = !!data;
  return exists;
}

/* ---------------------------------------------------------------------------- */

export async function ensureProgramRecord(program: Program): Promise<string> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error("Not authenticated");

  const isNew = !(await doesProgramExist(program.id));

  if (isNew) {
    const { data: programData, error } = await insertProgram({
      user_id: user.id,
      name: program.name,
      description: program.description,
      goal: program.goal,
      mode: program.mode,
    });

    if (error || !programData) {
      console.error("❌ Failed to insert new program", error?.message);
      throw new Error(error?.message || "Failed to create program");
    }

    return programData.id;
  } else {
    const { error } = await updateProgram(program);
    if (error) {
      console.error("❌ Failed to update program", error.message);
      throw new Error(error.message);
    }

    return program.id;
  }
}

/* ---------------------------------------------------------------------------- */

export async function clearProgramChildren(
  programId: string,
  mode: Program["mode"]
) {
  const supabase = createClient();

  if (mode === "blocks") {
    const { error } = await supabase
      .from("program_blocks")
      .delete()
      .eq("program_id", programId);
    if (error) console.error("❌ Error deleting program_blocks", error.message);
  } else {
    const { error } = await supabase
      .from("program_days")
      .delete()
      .eq("program_id", programId);
    if (error) console.error("❌ Error deleting program_days", error.message);
  }
}

/* ---------------------------------------------------------------------------- */

export async function insertProgramStructure(
  programId: string,
  program: Program
) {
  if (program.mode === "days" && program.days) {
    const { data: daysData, error } = await insertProgramDays(
      programId,
      program.days
    );
    if (error) {
      console.error("❌ insertProgramDays error", error.message);
      throw error;
    }
    await insertDaysWithWorkouts(daysData || [], program.days);
  }

  if (program.mode === "blocks" && program.blocks) {
    const { data: blocksData, error: blockError } = await insertProgramBlocks(
      programId,
      program.blocks
    );
    if (blockError) {
      console.error("❌ insertProgramBlocks error", blockError.message);
      throw blockError;
    }

    for (let i = 0; i < program.blocks.length; i++) {
      const insertedBlock = blocksData?.[i];
      if (!insertedBlock) {
        continue;
      }

      const block = program.blocks[i];
      const { data: daysData, error: daysError } = await insertProgramDays(
        programId,
        block.days,
        insertedBlock.id
      );
      if (daysError) {
        console.error("❌ insertProgramDays (block) error", daysError.message);
        throw daysError;
      }

      await insertDaysWithWorkouts(daysData || [], block.days);
    }
  }
}

export async function insertProgramDays(
  programId: string,
  days: ProgramDay[],
  blockId?: string
) {
  const supabase = createClient();
  const payload = days.map((day, index) => ({
    program_id: programId,
    block_id: blockId,
    name: day.name,
    description: day.description,
    order_num: index,
    type: day.type,
  }));

  return supabase.from("program_days").insert(payload).select();
}

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
  const supabase = createClient();

  return supabase
    .from("programs")
    .insert({ user_id, name, description, goal, mode })
    .select()
    .single();
}

export async function insertExerciseSets(
  workoutExerciseId: string,
  sets: SetInfo[]
) {
  const supabase = createClient();
  const payload = sets.map((set, index) => ({
    workout_exercise_id: workoutExerciseId,
    reps: set.reps,
    rest: set.rest,
    rpe: set.rpe ?? null,
    rir: set.rir ?? null,
    one_rep_max_percent: set.one_rep_max_percent ?? null,
    set_index: index,
    set_type: set.set_type ?? "standard",
  }));

  const { data, error } = await supabase
    .from("exercise_sets")
    .insert(payload)
    .select();
  if (error) {
    console.error("❌ insertExerciseSets error", error.message);
    return null;
  }
  return data;
}

export async function insertWorkoutExercises(
  groupId: string,
  exercises: WorkoutExercise[]
) {
  const supabase = createClient();
  const payload = exercises.map((ex, index) => ({
    workout_group_id: groupId,
    exercise_id: ex.exercise_id,
    name: ex.name,
    intensity: ex.intensity,
    notes: ex.notes ?? "",
    order_num: index,
  }));
  return supabase.from("workout_exercises").insert(payload).select();
}

/* ---------------------------------------------------------------------------- */

export async function updateProgram(program: Program) {
  const supabase = createClient();
  return await supabase
    .from("programs")
    .update({
      name: program.name,
      description: program.description,
      goal: program.goal,
      mode: program.mode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", program.id);
}

/* ---------------------------------------------------------------------------- */

export async function getAllProgramsForUser(): Promise<Program[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs").select("*");

  if (error) {
    console.error("❌ getAllProgramsForUser error", error.message);
    throw error;
  }

  const mapped =
    data?.map((p) => ({
      ...p,
      createdAt: new Date(p.created_at ?? ""),
      updatedAt: new Date(p.updated_at ?? ""),
    })) ?? [];

  return mapped;
}

/* ---------------------------------------------------------------------------- */

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      blocks:program_blocks (
        *,
        days:program_days (
          *,
          workout:workouts (
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
        workout:workouts (
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
    console.error("❌ getProgramById error", error.message);
    throw error;
  }

  return data as Program;
}
