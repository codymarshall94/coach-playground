import { insertExerciseSets } from "@/lib/supabase/exerciseSets";
import { insertProgramBlocks } from "@/lib/supabase/programBlocks";
import { insertProgramDays } from "@/lib/supabase/programDays";
import { insertProgram } from "@/lib/supabase/programs";
import { insertWorkoutExercises } from "@/lib/supabase/workoutExercises";
import { insertWorkout } from "@/lib/supabase/workouts";
import { Program, ProgramDay, WorkoutExercise } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

/* ---------------------------------------------------------------------------- */

export async function insertDaysWithWorkouts(
  insertedDays: ProgramDay[],
  originalDays: ProgramDay[]
) {
  let failureCount = 0;

  for (let i = 0; i < insertedDays.length; i++) {
    const insertedDay = insertedDays[i];
    const originalDay = originalDays[i];
    const workout = originalDay.workout?.[0];

    if (!workout || !Array.isArray(workout.exercises)) {
      continue;
    }

    const { data: workoutData, error: workoutError } = await insertWorkout(
      insertedDay.id
    );
    if (workoutError || !workoutData) {
      failureCount++;
      continue;
    }

    const workoutExercisePayloads = workout.exercises.map((ex, index) => ({
      workout_id: workoutData.id,
      exercise_id: ex.exercise_id,
      name: ex.name,
      intensity: ex.intensity,
      notes: ex.notes ?? "",
      order_num: index,
    }));

    const { data: insertedExercises, error } = await insertWorkoutExercises(
      workoutData.id,
      workoutExercisePayloads as unknown as WorkoutExercise[]
    );

    if (error || !insertedExercises?.length) {
      failureCount++;
      continue;
    }

    for (let i = 0; i < insertedExercises.length; i++) {
      const setData = await insertExerciseSets(
        insertedExercises[i].id,
        workout.exercises[i].sets
      );

      if (!setData) {
        failureCount++;
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
