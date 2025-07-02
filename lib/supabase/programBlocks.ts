import { ProgramBlock } from "@/types/Workout";
import { createClient } from "@/utils/supabase/client";

export async function insertProgramBlocks(
  programId: string,
  blocks: ProgramBlock[]
) {
  const supabase = createClient();

  console.log("🧠 insertProgramBlocks blocks", blocks);

  const payload = blocks.map((block, index) => ({
    program_id: programId,
    name: block.name,
    description: block.description,
    order_num: index,
    weeks: block.weeks ?? 4, // <-- safeguard
  }));

  console.log("🧠 insertProgramBlocks payload", payload);

  return supabase.from("program_blocks").insert(payload).select();
}
