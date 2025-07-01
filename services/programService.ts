import { insertExerciseSets } from "@/lib/supabase/exerciseSets";
import { insertProgramBlocks } from "@/lib/supabase/programBlocks";
import { insertProgramDays } from "@/lib/supabase/programDays";
import { insertProgram } from "@/lib/supabase/programs";
import { insertWorkoutExercises } from "@/lib/supabase/workoutExercises";
import { insertWorkout } from "@/lib/supabase/workouts";
import { Program } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export async function saveProgramService(program: Program) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error("Not authenticated");

  // Insert program
  const { data: programData, error } = await insertProgram({
    user_id: user.id,
    name: program.name,
    description: program.description,
    goal: program.goal,
    mode: program.mode,
  });

  if (error || !programData)
    throw new Error(error?.message || "Failed to create program");

  // MODE: "days"
  if (program.mode === "days" && program.days) {
    const { data: daysData } = await insertProgramDays(
      programData.id,
      program.days
    );

    if (daysData) {
      for (let i = 0; i < program.days.length; i++) {
        const originalDay = program.days[i];
        const insertedDay = daysData[i];

        const { data: workoutData } = await insertWorkout(insertedDay.id);

        if (workoutData) {
          for (const ex of originalDay.workout[0]?.exercises || []) {
            const { data: insertedExercises } = await insertWorkoutExercises(
              workoutData.id,
              [ex]
            );
            if (insertedExercises && insertedExercises.length > 0) {
              await insertExerciseSets(insertedExercises[0].id, ex.sets);
            }
          }
        }
      }
    }
  }

  // MODE: "blocks"
  if (program.mode === "blocks" && program.blocks) {
    const { data: blocksData } = await insertProgramBlocks(
      programData.id,
      program.blocks
    );

    if (blocksData) {
      for (let b = 0; b < program.blocks.length; b++) {
        const block = program.blocks[b];
        const insertedBlock = blocksData[b];

        const { data: daysData } = await insertProgramDays(
          insertedBlock.id,
          block.days
        );

        for (let d = 0; d < block.days.length; d++) {
          const originalDay = block.days[d];
          const insertedDay = daysData?.[d];

          const { data: workoutData } = await insertWorkout(insertedDay.id);

          if (workoutData) {
            for (const ex of originalDay.workout[0]?.exercises || []) {
              const { data: insertedExercises } = await insertWorkoutExercises(
                workoutData.id,
                [ex]
              );
              if (insertedExercises && insertedExercises.length > 0) {
                await insertExerciseSets(insertedExercises[0].id, ex.sets);
              }
            }
          }
        }
      }
    }
  }

  redirect(`/programs/${programData.id}`);
}

export async function getAllProgramsForUser(): Promise<Program[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("programs")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProgramById error", error.message);
    throw error;
  }

  return data;
}
