"use client";

import { usePrograms } from "@/hooks/usePrograms";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProgramListPage() {
  const { data: programs, isLoading, error } = usePrograms();

  if (isLoading) return <p>Loading programs...</p>;
  if (error) return <p>Error loading programs</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Programs</h1>
      <ul className="space-y-3">
        {programs?.map((program) => (
          <li
            key={program.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{program.name}</h2>
              <p className="text-sm text-muted-foreground">{program.goal}</p>
            </div>
            <Link href={`/programs/${program.id}`}>
              <Button variant="default">Edit</Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
