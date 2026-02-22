"use client";

import { Button } from "@/components/ui/button";
import { useProgramVersions } from "@/hooks/useProgramVersions";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { History, RotateCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VersionHistoryPanelProps {
  programId: string;
  /** Called after a successful restore so the builder can reload the program */
  onRestored?: () => void;
}

export function VersionHistoryPanel({
  programId,
  onRestored,
}: VersionHistoryPanelProps) {
  const { versions, isLoading, restore, isRestoring } =
    useProgramVersions(programId);
  const [expanded, setExpanded] = useState(false);

  const handleRestore = async (versionId: string, version: number) => {
    if (
      !confirm(
        `Restore to version ${version}? Your current state will be saved as a new version first.`
      )
    )
      return;

    try {
      await restore({ versionId });
      toast.success(`Restored to version ${version}`);
      onRestored?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to restore version"
      );
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-1"
      >
        <History className="w-4 h-4" />
        <span>Version History</span>
        {versions.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {versions.length} version{versions.length !== 1 ? "s" : ""}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(false)}
        className="flex items-center gap-2 text-sm font-medium text-foreground w-full py-1"
      >
        <History className="w-4 h-4" />
        <span>Version History</span>
      </button>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Loading versions…
        </div>
      ) : versions.length === 0 ? (
        <p className="text-xs text-muted-foreground py-1">
          No versions yet. Versions are created automatically each time you
          save.
        </p>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {versions.map((v) => (
            <div
              key={v.id}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5",
                "text-xs bg-muted/50 hover:bg-muted transition-colors"
              )}
            >
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">
                  v{v.version}
                  {v.label && (
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      — {v.label}
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(v.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs shrink-0"
                disabled={isRestoring}
                onClick={() => handleRestore(v.id, v.version)}
              >
                {isRestoring ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RotateCcw className="w-3 h-3 mr-1" />
                )}
                Restore
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
