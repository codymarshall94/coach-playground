import { createClient } from "@/utils/supabase/client";
import { CredentialResponse } from "@react-oauth/google";

export async function signUpUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return {
    success: !error,
    user: data.user ?? null,
    error: error?.message,
  };
}

export async function setUserProfile({
  userId,
  fullName,
  username,
}: {
  userId: string;
  fullName: string;
  username: string;
}) {
  const supabase = await createClient();
  // Check uniqueness first
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  if (existing) return { success: false, error: "Username already taken" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, username })
    .eq("id", userId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function handleSignInWithGoogle(response: {
  credential: CredentialResponse;
  nonce?: string;
}) {
  const supabase = createClient();

  // The nonce must match the one embedded in the Google ID token.
  // Pass it from the GSI callback or omit it if your GSI config
  // does not set a nonce (Supabase will skip the check).
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential.credential ?? "",
    ...(response.nonce ? { nonce: response.nonce } : {}),
  });

  return {
    success: !error,
    user: data.user ?? null,
    error: error?.message,
  };
}
