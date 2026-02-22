"use client";

import { Button } from "@/components/ui/button";
import { acquireProgram, hasAcquiredProgram } from "@/services/purchaseService";
import { BookPlus, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AcquireProgramButtonProps {
  programId: string;
  isFree: boolean;
  /** If the viewer is the program owner, hide the button entirely. */
  isOwner: boolean;
}

export function AcquireProgramButton({
  programId,
  isFree,
  isOwner,
}: AcquireProgramButtonProps) {
  const [acquired, setAcquired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already purchased on mount
  useEffect(() => {
    if (isOwner) {
      setChecking(false);
      return;
    }
    hasAcquiredProgram(programId)
      .then((has) => setAcquired(has))
      .finally(() => setChecking(false));
  }, [programId, isOwner]);

  if (isOwner) return null;

  const handleAcquire = async () => {
    if (!isFree) {
      toast.info("Paid programs will be supported soon!");
      return;
    }

    setLoading(true);
    try {
      await acquireProgram(programId);
      setAcquired(true);
      toast.success("Program added to your library!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add program";
      if (msg.includes("Not authenticated")) {
        toast.error("Sign in to add programs to your library.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Button disabled size="lg" className="min-w-[180px]">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading…
      </Button>
    );
  }

  if (acquired) {
    return (
      <Button disabled variant="outline" size="lg" className="min-w-[180px]">
        <Check className="w-4 h-4 mr-2" />
        In Your Library
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="min-w-[180px]"
      onClick={handleAcquire}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding…
        </>
      ) : (
        <>
          <BookPlus className="w-4 h-4 mr-2" />
          {isFree ? "Add to Library" : `Get Program`}
        </>
      )}
    </Button>
  );
}
