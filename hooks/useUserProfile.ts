"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Profile } from "@/types/Profile";

export function useUserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));
  }, []);

  return { profile, loading, refreshProfile };
}
