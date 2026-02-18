import { createClient } from "@/utils/supabase/client";

const BUCKET = "program-covers";

const supabase = createClient();

/**
 * Upload a program cover image to Supabase Storage.
 * File is stored under `{userId}/{programId}.{ext}`.
 * Returns the public URL on success.
 */
export async function uploadCoverImage(
  file: File,
  programId: string
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${programId}.${ext}`;

  // Upsert so re-uploads replace the previous image
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // Append cache-buster so browsers pick up the new version
  return `${publicUrl}?t=${Date.now()}`;
}

/**
 * Delete a program cover image from Supabase Storage.
 */
export async function deleteCoverImage(
  programId: string,
  currentUrl: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Extract path from the full URL
  const bucketBase = `/storage/v1/object/public/${BUCKET}/`;
  const idx = currentUrl.indexOf(bucketBase);
  if (idx === -1) return;

  let path = currentUrl.slice(idx + bucketBase.length);
  // Strip cache-buster query params
  path = path.split("?")[0];

  await supabase.storage.from(BUCKET).remove([path]);
}
