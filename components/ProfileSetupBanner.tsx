"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";

/**
 * A slim, dismissable banner that nudges users to finish setting up their
 * profile. Shown only when `profile_completed` is false and the user hasn't
 * already dismissed it.
 */
export function ProfileSetupBanner() {
  const { profile, loading } = useUserProfile();
  const [dismissed, setDismissed] = useLocalStorage(
    "profile-banner-dismissed",
    false
  );

  if (loading || !profile || profile.profile_completed || dismissed) {
    return null;
  }

  return (
    <div className="relative flex items-center justify-center gap-2 bg-primary/10 border-b border-primary/20 px-4 py-2 text-sm text-primary">
      <span className="text-center">
        No rush — finish setting up your profile whenever you&apos;re ready.
      </span>
      <Link
        href="/profile/setup"
        className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        Set it up
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-primary/10 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
