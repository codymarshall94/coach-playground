"use client";

import ProgramCard from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrograms } from "@/hooks/usePrograms";
import { deleteProgram } from "@/services/programs/deleteProgram";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function MyProgramsPage() {
  const { data: programs, isLoading, error } = usePrograms();
  const [removing, setRemoving] = useState<string | null>(null);
  const [local, setLocal] = useState(programs ?? []);
  const queryClient = useQueryClient();
  useMemo(() => setLocal(programs ?? []), [programs]);

  async function handleDelete(id: string) {
    setRemoving(id);
    const prev = local;
    setLocal((curr) => curr.filter((p) => p.id !== id));
    try {
      await deleteProgram(id);
      await queryClient.invalidateQueries({ queryKey: ["programs"] });
    } catch (e) {
      setLocal(prev);
      console.error(e);
    } finally {
      setRemoving(null);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return <p className="p-6 text-destructive">Error loading programs.</p>;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-tight">Your Programs</h1>
        <Button asChild className="gap-2">
          <Link href="/programs/new">
            <Plus className="h-4 w-4" />
            New Program
          </Link>
        </Button>
      </div>

      {local?.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {local.map((p) => (
            <div key={p.id} className={removing === p.id ? "opacity-50" : ""}>
              <ProgramCard program={p} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">No programs yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start building your first program to track and organize training.
          </p>
          <Button asChild className="mt-4">
            <Link href="/programs/new">Create Program</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
