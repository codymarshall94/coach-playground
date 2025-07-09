"use client";

import { cn } from "@/lib/utils";

interface ArmIconProps {
  className?: string;
  strokeWidth?: number;
}

export function ArmIcon({ className, strokeWidth = 1.8 }: ArmIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 stroke-current", className)}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4c-.5 2-2 6-4 8s-6 2-6 5c0 2 2 3 4 3s4-1 6-3 3-5 4-7 2-4 2-5c0-.5-.2-2-2-2s-3 1-4 2" />
    </svg>
  );
}

export default ArmIcon;
