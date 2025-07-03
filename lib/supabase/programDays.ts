import { ProgramDay } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

export async function insertProgramDays(
  programId: string,
  days: ProgramDay[],
  blockId?: string
) {
  console.log("🧠 insertProgramDays payload", days);

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
