import { createClient } from "@/utils/supabase/server";

export const getProfileBySlug = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", slug)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};
