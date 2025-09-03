import { EmptyState } from "@/components/EmptyState";
import Image from "next/image";

export function RestDayEmpty() {
  return (
    <EmptyState
      className="w-full mt-6"
      image={
        <Image
          src="/images/empty-states/rest-day.png"
          alt="Rest Day"
          width={300}
          height={300}
        />
      }
      title="Rest Day"
      description="You have programmed a rest day for this workout"
    />
  );
}
