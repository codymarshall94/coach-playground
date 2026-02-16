"use client";

import React, { useCallback, useState } from "react";
import ProgramCard from "@/components/ProgramCard";
import type { Program } from "@/types/Workout";
import { toast } from "sonner";
import NoProgramsEmpty from "@/components/NoProgramsEmpty";

type Props = {
  initialPrograms: Array<Partial<Program>>;
};

export default function ProgramsView({ initialPrograms }: Props) {
  const [programs, setPrograms] = useState(initialPrograms || []);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

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

  if (!programs || programs.length === 0) {
    return <NoProgramsEmpty />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((p) => (
        <div key={p.id} className={loadingIds[p.id as string] ? "opacity-50" : ""}>
          <ProgramCard
            program={p as Program}
            onDelete={(id: string) => {
              // confirm client-side
              if (confirm("Delete this program? This cannot be undone.")) {
                handleDelete(id);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
