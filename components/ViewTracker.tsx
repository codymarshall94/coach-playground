"use client";

import { recordProgramView } from "@/services/analyticsService";
import { useEffect, useRef } from "react";

/**
 * Invisible client component that fires a single view-tracking RPC on mount.
 * Drop it into any server-rendered page to record a page view.
 */
export function ViewTracker({ programId }: { programId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    recordProgramView(programId);
  }, [programId]);

  return null;
}
