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

export const updateProfileWithSlug = async (
  name: string,
  slug: string,
  userId: string
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ name, username: slug })
    .eq("id", userId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};
