import { cn } from "@/lib/utils";

const colorVariants = {
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  "custom-primary": "bg-custom-primary",
  orange: "bg-orange-500",
  indigo: "bg-indigo-700",
};

export default function HighlightedText({
  children,
  color = "custom-primary",
  skew = 2,
  opacity = 60,
  className,
}: {
  children: React.ReactNode;
  color?: keyof typeof colorVariants;
  skew?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <span
        className={cn(
          "absolute bottom-1 left-0 w-full h-2 z-0",
          colorVariants[color],
          `opacity-${opacity}`,
          `transform -skew-y-${Math.abs(skew)}`
        )}
        style={{
          transformOrigin: "left center",
          ...(skew > 0 ? { transform: `skewY(${skew}deg)` } : {}),
        }}
      />
    </span>
  );
}
