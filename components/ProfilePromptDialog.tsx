"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Dumbbell, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Shows once after signup when `profile_completed` is still false.
 * Offers two paths: continue building programs or set up profile.
 */
export function ProfilePromptDialog() {
  const router = useRouter();
  const { profile, loading } = useUserProfile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading || !profile) return;
    // Only show if profile exists but setup wasn't completed
    if (!profile.profile_completed) {
      // Small delay so the page has time to render first
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [loading, profile]);

  const goPrograms = () => {
    setOpen(false);
  };

  const goSetup = () => {
    setOpen(false);
    router.push("/profile/setup");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">
            Welcome to PRGRM!
          </DialogTitle>
          <DialogDescription className="text-sm">
            What would you like to do first?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-2">
          <Button
            variant="outline"
            className="h-auto py-4 justify-start gap-3"
            onClick={goPrograms}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Start building</p>
              <p className="text-xs text-muted-foreground">
                Jump straight into creating a program
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 justify-start gap-3"
            onClick={goSetup}
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <UserCog className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Set up my profile</p>
              <p className="text-xs text-muted-foreground">
                Add your name, photo, and brand info
              </p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
