import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  lineBreak = true,
}: {
  className?: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  lineBreak?: boolean;
}) {
  const sizeVariants = {
    xxs: "text-sm md:text-base",
    xs: "text-base md:text-lg",
    sm: "text-2xl md:text-3xl",
    md: "text-5xl md:text-7xl",
    lg: "text-6xl md:text-8xl",
  };
  return (
    <h1
      className={`font-black text-gray-900 ${sizeVariants[size]} ${className}`}
    >
      THE WORKOUT
      {lineBreak && <br />}
      <span
        className={cn(
          "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
          sizeVariants[size],
          !lineBreak && "ml-1"
        )}
      >
        SANDBOX
      </span>
    </h1>
  );
}
