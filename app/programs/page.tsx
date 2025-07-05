"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrograms } from "@/hooks/usePrograms";
import { Flame, Plus } from "lucide-react";
import Link from "next/link";

export default function MyProgramsPage() {
  const { data: programs, isLoading, error } = usePrograms();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-500">Error loading programs.</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Programs</h1>
        <Link href="/programs/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Program
          </Button>
        </Link>
      </div>

      {programs?.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          You haven’t created any programs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs?.map((program) => (
            <Link
              key={program.id}
              href={`/programs/${program.id}`}
              className="group p-5 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold truncate">
                  {program.name}
                </h2>
                <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition" />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {program.goal || "No goal set"}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">
                  {program.mode === "blocks" ? "Block-based" : "Day-based"}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
