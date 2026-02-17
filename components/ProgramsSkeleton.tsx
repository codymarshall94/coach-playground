"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramsSkeleton() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64 rounded" />
        <Skeleton className="h-5 w-96 rounded" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-40 rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
