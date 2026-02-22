import { Tables } from "@/database.types";

/** Row type pulled straight from the generated Supabase schema. */
export type Profile = Tables<"profiles">;

/** Subset used when updating a profile (all fields optional except id). */
export type ProfileUpdate = Partial<
  Omit<Profile, "id" | "created_at">
>;

export type AccountType = "personal" | "brand";
