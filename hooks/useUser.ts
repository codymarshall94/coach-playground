import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setUser(data?.user ?? null);
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  return { user, loading, refreshUser };
}
