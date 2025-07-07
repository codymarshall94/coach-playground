import { createClient } from "./supabase/client";

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
];

export async function generateAvailableUsername(
  name: string,
  maxAttempts = 10
): Promise<string | null> {
  const supabase = createClient();
  const base = slugify(name);

  if (!base || base.length < 3) return null;
  if (RESERVED_USERNAMES.includes(base)) return null;

  // Try base first
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

  return null; // ❌ none available
}
