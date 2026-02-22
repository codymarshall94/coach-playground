import { Profile, ProfileUpdate } from "@/types/Profile";
import { createClient } from "@/utils/supabase/server";

// ---------------------------------------------------------------------------
// Server-side profile service (uses server Supabase client)
// ---------------------------------------------------------------------------

/** Fetch a public profile by its username slug. */
export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", slug)
    .single();

  if (error) {
    console.error("getProfileBySlug error:", error);
    return null;
  }

  return data;
}

/** Fetch a profile by its user ID (auth uid). */
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("getProfileById error:", error);
    return null;
  }

  return data;
}

/** Generic profile update — accepts any subset of mutable profile fields. */
export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("updateProfile error:", error);
    return null;
  }

  return data;
}

/** Convenience: update name + username slug in one call. */
export async function updateProfileWithSlug(
  fullName: string,
  slug: string,
  userId: string,
): Promise<Profile | null> {
  return updateProfile(userId, { full_name: fullName, username: slug });
}

/** Fetch published programs belonging to a user (for their public profile). */
export async function getPublicProgramsByUserId(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .select("id, name, description, goal, mode, cover_image, price, currency, slug, created_at, updated_at, program_days(count), program_blocks(count)")
    .eq("user_id", userId)
    .eq("is_template", false)
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getPublicProgramsByUserId error:", error);
    return [];
  }

  return data;
}

/** Fetch all published programs (for marketplace). */
export async function getPublishedPrograms() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .select(
      "id, name, description, goal, mode, cover_image, price, currency, slug, published_at, published_version_id, created_at, updated_at, user_id, program_days(count), program_blocks(count), profiles!programs_profile_id_fkey(username, full_name, brand_name, account_type, avatar_url, logo_url)"
    )
    .eq("is_template", false)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getPublishedPrograms error:", error);
    return [];
  }

  return data;
}

/** Shape returned by getPublishedProgramById — snapshot merged with live metadata. */
interface PublishedProgramData {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  mode: string;
  cover_image: string | null;
  price: number | null;
  currency: string;
  published_at: string | null;
  is_published: boolean;
  listing_metadata: import("@/types/Workout").ListingMetadata | null;
  profiles: {
    username: string | null;
    full_name: string | null;
    brand_name: string | null;
    account_type: string;
    avatar_url: string | null;
    logo_url: string | null;
  } | null;
  // Nested program data from snapshot (blocks, days, etc.)
  [key: string]: unknown;
}

/** Fetch a single published program's snapshot + metadata (for public read-only view).
 *  Accepts a slug (e.g. "alex-push-pull-legs") OR a UUID.
 */
export async function getPublishedProgramById(
  idOrSlug: string
): Promise<PublishedProgramData | null> {
  const supabase = await createClient();

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug,
    );

  // 1) Fetch program metadata + author profile (by slug or UUID)
  let query = supabase
    .from("programs")
    .select(
      "id, name, description, goal, mode, cover_image, price, currency, slug, published_at, published_version_id, is_published, listing_metadata, user_id, profiles!programs_profile_id_fkey(username, full_name, brand_name, account_type, avatar_url, logo_url)"
    )
    .eq("is_published", true);

  if (isUuid) {
    query = query.eq("id", idOrSlug);
  } else {
    query = query.eq("slug", idOrSlug);
  }

  const { data: program, error: progErr } = await query.single();

  if (progErr || !program) {
    console.error("getPublishedProgramById error:", progErr);
    return null;
  }

  // 2) If there's a published version snapshot, use it
  if (program.published_version_id) {
    const { data: version, error: verErr } = await supabase
      .from("program_versions")
      .select("snapshot")
      .eq("id", program.published_version_id)
      .single();

    if (verErr || !version) {
      console.error("getPublishedProgramById version error:", verErr);
      return null;
    }

    // Return the snapshot enriched with live metadata (price, profile)
    return {
      ...(version.snapshot as Record<string, unknown>),
      // Override with live metadata
      price: program.price,
      currency: program.currency,
      published_at: program.published_at,
      is_published: program.is_published,
      listing_metadata: program.listing_metadata,
      user_id: program.user_id,
      // Attach author profile
      profiles: program.profiles,
    } as unknown as PublishedProgramData;
  }

  // 3) Fallback for programs published before the snapshot system
  //    (shouldn't happen for new publishes, but safety net)
  return null;
}