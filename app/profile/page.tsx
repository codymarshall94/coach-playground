import { getProfileById } from "@/services/profileService";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile — PRGRM",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/profile");

  const profile = await getProfileById(user.id);

  // If profile setup isn't complete, send them through the wizard
  if (!profile?.profile_completed) {
    redirect("/profile/setup");
  }

  // If they have a username, send them to their public profile
  if (profile.username) {
    redirect(`/u/${profile.username}`);
  }

  // Completed but no username — send to settings
  redirect("/profile/settings");
}
