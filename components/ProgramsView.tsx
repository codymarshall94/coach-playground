"use client";

import React, { useCallback, useState } from "react";
import ProgramCard from "@/components/ProgramCard";
import PurchasedProgramCard from "@/components/PurchasedProgramCard";
import type { Program } from "@/types/Workout";
import type { PurchasedProgram } from "@/services/purchaseService";
import { removePurchasedProgram } from "@/services/purchaseService";
import { toast } from "sonner";
import { duplicateProgram } from "@/services/programService";
import NoProgramsEmpty from "@/components/NoProgramsEmpty";
import { Globe, FileEdit, Library, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  initialPrograms: Array<Partial<Program>>;
  viewCounts?: Record<string, number>;
  purchasedPrograms?: PurchasedProgram[];
};

export default function ProgramsView({
  initialPrograms,
  viewCounts = {},
  purchasedPrograms = [],
}: Props) {
  const [programs, setPrograms] = useState(initialPrograms || []);
  const [purchased, setPurchased] = useState(purchasedPrograms);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [deletingAll, setDeletingAll] = useState(false);
  const [duplicatingIds, setDuplicatingIds] = useState<Record<string, boolean>>({});

  const handleDuplicate = useCallback(async (id: string) => {
    setDuplicatingIds((s) => ({ ...s, [id]: true }));
    try {
      const dup = await duplicateProgram(id);
      setPrograms((p) => [dup as Partial<Program>, ...p]);
      toast.success("Program duplicated");
    } catch (err) {
      console.error("[ProgramsView] duplicate error", err);
      toast.error(err instanceof Error ? err.message : "Failed to duplicate");
    } finally {
      setDuplicatingIds((s) => ({ ...s, [id]: false }));
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    // optimistic remove locally — capture previous list so we can rollback
    const prev = programs;
    setPrograms((p) => p.filter((x) => x.id !== id));
    setLoadingIds((s) => ({ ...s, [id]: true }));

    try {
      const res = await fetch("/api/programs/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[ProgramsView] delete failed", json);
        // rollback optimistic removal
        setPrograms(prev);
        toast.error(json?.error || "Failed to delete program");
        return;
      }

      // success
      toast.success("Program deleted");
    } catch (err) {
      console.error("[ProgramsView] delete error", err);
      // rollback optimistic removal
      setPrograms(prev);
      toast.error(err instanceof Error ? err.message : "Failed to delete program");
    } finally {
      setLoadingIds((s) => ({ ...s, [id]: false }));
    }
  }, [programs]);

  const handleDeleteAll = useCallback(async () => {
    const count = programs.length;
    if (
      !confirm(
        `Delete all ${count} program${count !== 1 ? "s" : ""}? This cannot be undone.`
      )
    )
      return;

    setDeletingAll(true);
    const prev = [...programs];
    setPrograms([]);

    const failed: string[] = [];

    // Delete sequentially to avoid hammering the API
    for (const p of prev) {
      try {
        const res = await fetch("/api/programs/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: p.id }),
        });
        if (!res.ok) {
          failed.push(p.name ?? p.id ?? "Unknown");
        }
      } catch {
        failed.push(p.name ?? p.id ?? "Unknown");
      }
    }

    if (failed.length > 0) {
      // Rollback the ones that failed
      setPrograms(prev.filter((p) => failed.includes(p.name ?? p.id ?? "")));
      toast.error(`Failed to delete ${failed.length} program(s)`);
    } else {
      toast.success(`Deleted ${count} program${count !== 1 ? "s" : ""}`);
    }

    setDeletingAll(false);
  }, [programs]);

  const handleRemovePurchased = useCallback(async (purchaseId: string) => {
    const prev = purchased;
    setPurchased((p) => p.filter((pp) => pp.purchase_id !== purchaseId));
    try {
      await removePurchasedProgram(purchaseId);
      toast.success("Removed from your library");
    } catch (err) {
      setPurchased(prev);
      toast.error(err instanceof Error ? err.message : "Failed to remove");
    }
  }, [purchased]);

  if (!programs || programs.length === 0) {
    if (purchased.length === 0) {
      return <NoProgramsEmpty />;
    }
  }

  const published = programs.filter((p) => p.is_published);
  const drafts = programs.filter((p) => !p.is_published);

  return (
    <div className="space-y-10">
      {/* Published programs */}
      {published.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
            <h2 className="text-lg font-semibold">Published</h2>
            <span className="text-xs text-muted-foreground">
              ({published.length})
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((p) => (
              <div
                key={p.id}
                className={
                  loadingIds[p.id as string] ||
                  duplicatingIds[p.id as string]
                    ? "opacity-50"
                    : ""
                }
              >
                <ProgramCard
                  program={p as Program}
                  viewCount={viewCounts[p.id as string]}
                  onDuplicate={(id: string) => handleDuplicate(id)}
                  onDelete={(id: string) => {
                    if (
                      confirm(
                        "Delete this program? This cannot be undone.",
                      )
                    ) {
                      handleDelete(id);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Draft programs */}
      {drafts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileEdit className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Drafts</h2>
            <span className="text-xs text-muted-foreground">
              ({drafts.length})
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((p) => (
              <div
                key={p.id}
                className={
                  loadingIds[p.id as string] ||
                  duplicatingIds[p.id as string]
                    ? "opacity-50"
                    : ""
                }
              >
                <ProgramCard
                  program={p as Program}
                  viewCount={viewCounts[p.id as string]}
                  onDuplicate={(id: string) => handleDuplicate(id)}
                  onDelete={(id: string) => {
                    if (
                      confirm(
                        "Delete this program? This cannot be undone.",
                      )
                    ) {
                      handleDelete(id);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Purchased / Library */}
      {purchased.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Library className="w-4 h-4 text-brand" />
            <h2 className="text-lg font-semibold">My Library</h2>
            <span className="text-xs text-muted-foreground">
              ({purchased.length})
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {purchased.map((pp) => (
              <PurchasedProgramCard
                key={pp.purchase_id}
                program={pp}
                onRemove={handleRemovePurchased}
              />
            ))}
          </div>
        </section>
      )}

      {/* Danger zone: delete all owned programs */}
      {programs.length > 0 && (
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDeleteAll}
            disabled={deletingAll}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            {deletingAll ? "Deleting…" : "Delete All"}
          </Button>
        </div>
      )}
    </div>
  );
}
