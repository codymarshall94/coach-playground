"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import {
  slugFromEmail,
  generateAvailableUsernameServer,
} from "@/utils/slugify";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const redirectTo = (formData.get("redirect") as string) || "/programs";

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const friendlyMessage =
      {
        "Invalid login credentials": "Email or password is incorrect",
        "User not found": "No account with that email exists",
      }[error.message] ?? "Login failed";

    redirect(`/login?error=${encodeURIComponent(friendlyMessage)}&redirect=${encodeURIComponent(redirectTo)}`);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const redirectTo = (formData.get("redirect") as string) || "/profile/setup";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(
      `/error?message=${encodeURIComponent(error.message || "Sign-up failed. Please try again.")}`
    );
  }

  // Auto-assign a username from the email so every user has a slug from day one.
  // The Supabase trigger creates the profile row; we update it with the username.
  const userId = signUpData.user?.id;
  if (userId) {
    const seed = slugFromEmail(email);
    const username = await generateAvailableUsernameServer(supabase, seed);

    if (username) {
      await supabase
        .from("profiles")
        .update({ username })
        .eq("id", userId);
    }
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
