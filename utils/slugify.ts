import { createClient } from "./supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const RESERVED_USERNAMES = [
  "admin",
  "support",
  "root",
  "me",
  "login",
  "signup",
  "user",
  "u",
  "api",
  "profile",
  "settings",
  "help",
  "programs",
  "auth",
  "error",
];

/** Extract a slug-friendly base from an email address. */
export function slugFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  return slugify(local);
}

/**
 * Find an available username, checking against the DB.
 * Works with both client and server Supabase instances.
 */
async function findAvailableSlug(
  supabase: SupabaseClient,
  base: string,
  maxAttempts = 10,
): Promise<string | null> {
  if (!base || base.length < 3) return null;
  if (RESERVED_USERNAMES.includes(base)) {
    // Append a number to escape the reserved word
    return findAvailableSlug(supabase, `${base}-1`, maxAttempts);
  }

  let attempt = 0;
  while (attempt < maxAttempts) {
    const candidate = attempt === 0 ? base : `${base}-${attempt}`;
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", candidate);

    if (error) {
      console.error("Slug check failed", error);
      return null;
    }

    if (data.length === 0) return candidate; // ✅ available
    attempt++;
  }

  return null;
}

/** Client-side: generate an available username from a display name. */
export async function generateAvailableUsername(
  name: string,
  maxAttempts = 10,
): Promise<string | null> {
  const supabase = createClient();
  return findAvailableSlug(supabase, slugify(name), maxAttempts);
}

/** Server-side: generate an available username using an existing Supabase client. */
export async function generateAvailableUsernameServer(
  supabase: SupabaseClient,
  seed: string,
  maxAttempts = 10,
): Promise<string | null> {
  return findAvailableSlug(supabase, slugify(seed), maxAttempts);
}
