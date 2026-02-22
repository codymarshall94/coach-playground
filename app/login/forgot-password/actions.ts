"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email) {
    redirect(
      `/login/forgot-password?error=${encodeURIComponent("Please enter your email address")}`
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/login/reset-password`,
  });

  if (error) {
    redirect(
      `/login/forgot-password?error=${encodeURIComponent(error.message)}`
    );
  }

  // Always show success (even if email doesn't exist) to prevent email enumeration
  redirect("/login/forgot-password?success=true");
}
