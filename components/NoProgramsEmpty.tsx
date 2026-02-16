"use client";

import Link from "next/link";
import Image from "next/image";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";

export default function NoProgramsEmpty() {
  return (
    <EmptyState
      className="w-full mt-6"
      title="No programs yet"
      description="You haven't created any programs. Start by creating a new program or explore templates to get started."
      action={
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link href="/programs/new">
            <Button variant="default">New Program</Button>
          </Link>
          <Link href="/programs/templates">
            <Button variant="outline">Browse Templates</Button>
          </Link>
        </div>
      }
    />
  );
}
