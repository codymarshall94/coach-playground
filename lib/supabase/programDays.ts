import { ProgramDay } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

export async function insertProgramDays(programId: string, days: ProgramDay[]) {
  const supabase = createClient();
  const payload = days.map((day, index) => ({
    program_id: programId,
    name: day.name,
    description: day.description,
    order_num: index,
    type: day.type,
  }));

  return supabase.from("program_days").insert(payload).select();
}
