import { ProfileUpdate } from "@/types/Profile";
import { createClient } from "@/utils/supabase/client";

// ---------------------------------------------------------------------------
// Client-side profile helpers (storage uploads & realtime mutations)
// ---------------------------------------------------------------------------

const supabase = createClient();

async function requireUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

/** Upload an avatar image and return its public URL. */
export async function uploadAvatar(file: File): Promise<string> {
  const user = await requireUser();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`Avatar upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  return `${publicUrl}?t=${Date.now()}`;
}

/** Upload a brand logo and return its public URL. */
export async function uploadLogo(file: File): Promise<string> {
  const user = await requireUser();
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${user.id}/logo.${ext}`;

  const { error } = await supabase.storage
    .from("profile-assets")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`Logo upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-assets").getPublicUrl(path);

  return `${publicUrl}?t=${Date.now()}`;
}

/** Upload a cover/banner image and return its public URL. */
export async function uploadCoverImage(file: File): Promise<string> {
  const user = await requireUser();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/cover.${ext}`;

  const { error } = await supabase.storage
    .from("profile-assets")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`Cover upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-assets").getPublicUrl(path);

  return `${publicUrl}?t=${Date.now()}`;
}

/** Client-side profile update (used in the setup wizard). */
export async function updateProfileClient(
  updates: ProfileUpdate,
) {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error(`Profile update failed: ${error.message}`);
  return data;
}
