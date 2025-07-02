import { insertExerciseSets } from "@/lib/supabase/exerciseSets";
import { insertProgramBlocks } from "@/lib/supabase/programBlocks";
import { insertProgramDays } from "@/lib/supabase/programDays";
import { insertProgram } from "@/lib/supabase/programs";
import { insertWorkoutExercises } from "@/lib/supabase/workoutExercises";
import { insertWorkout } from "@/lib/supabase/workouts";
import { Program, ProgramDay, WorkoutExercise } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

async function insertDaysWithWorkouts(
  insertedDays: ProgramDay[],
  originalDays: ProgramDay[]
) {
  let failureCount = 0;

  for (let i = 0; i < insertedDays.length; i++) {
    const insertedDay = insertedDays[i];
    const originalDay = originalDays[i];
    const workout = originalDay.workout?.[0];
    if (!workout || !Array.isArray(workout.exercises)) continue;

    const { data: workoutData, error: workoutError } = await insertWorkout(
      insertedDay.id
    );
    if (workoutError || !workoutData) {
      console.error("❌ Failed to create workout", workoutError);
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
      console.error("❌ Failed to insert workout_exercises", error);
      failureCount++;
      continue;
    }

    for (let i = 0; i < insertedExercises.length; i++) {
      const setData = await insertExerciseSets(
        insertedExercises[i].id,
        workout.exercises[i].sets
      );

      if (!setData) {
        console.error("❌ Failed to insert sets");
        failureCount++;
      }
    }
  }

  if (failureCount > 0) {
    throw new Error(`insertDaysWithWorkouts failed for ${failureCount} day(s)`);
  }
}

// Save or update the entire program
export async function saveOrUpdateProgramService(program: Program) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) throw new Error("Not authenticated");

  const isNew = !(await doesProgramExist(program.id));
  let programId = program.id;

  // === INSERT ===
  if (isNew) {
    const { data: programData, error } = await insertProgram({
      user_id: user.id,
      name: program.name,
      description: program.description,
      goal: program.goal,
      mode: program.mode,
    });

    if (error || !programData) {
      throw new Error(error?.message || "Failed to create program");
    }

    programId = programData.id;
  }

  // === UPDATE ===
  else {
    const { error: updateError } = await updateProgram(program);
    if (updateError) throw new Error(updateError.message);

    // Clear previous children
    if (program.mode === "blocks") {
      await supabase
        .from("program_blocks")
        .delete()
        .eq("program_id", programId);
    } else {
      await supabase.from("program_days").delete().eq("program_id", programId);
    }
  }

  // === Insert Blocks or Days ===
  if (program.mode === "days" && program.days) {
    const { data: daysData } = await insertProgramDays(programId, program.days);
    await insertDaysWithWorkouts(daysData || [], program.days);
  }

  // === Insert Blocks or Days ===
  if (program.mode === "days" && program.days) {
    const { data: daysData } = await insertProgramDays(programId, program.days);
    await insertDaysWithWorkouts(daysData || [], program.days);
  }

  if (program.mode === "blocks" && program.blocks) {
    const { data: blocksData } = await insertProgramBlocks(
      programId,
      program.blocks
    );

    for (let b = 0; b < program.blocks.length; b++) {
      const block = program.blocks[b];
      const insertedBlock = blocksData?.[b];
      if (!insertedBlock) continue;

      const { data: daysData, error: daysError } = await insertProgramDays(
        programId,
        block.days,
        insertedBlock.id
      );

      console.log("🧠 daysData", daysData);
      console.log("🧠 daysError", daysError);

      await insertDaysWithWorkouts(daysData || [], block.days);
    }
  }

  return programId;
}

export async function doesProgramExist(programId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("id", programId)
    .single();
  return !!data;
}

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
export async function getAllProgramsForUser(): Promise<Program[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs").select("*");

  if (error) throw error;
  return (
    data?.map((p) => ({
      ...p,
      createdAt: new Date(p.created_at ?? ""),
      updatedAt: new Date(p.updated_at ?? ""),
    })) ?? []
  );
}

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
    console.error("getProgramById error", error.message);
    throw error;
  }

  return data as Program;
}
