import { EmptyState } from "@/components/EmptyState";
import Image from "next/image";

export function NoExercisesEmpty({ action }: { action?: React.ReactNode }) {
  return (
    <EmptyState
      className="w-full mt-6"
      image={
        <Image
          src="/images/empty-states/no-exercises.png"
          alt="No Exercises Added"
          width={300}
          height={300}
        />
      }
      title="No Exercises Added"
      description="Start building your program by adding exercises to this day."
      action={action}
    />
  );
}
