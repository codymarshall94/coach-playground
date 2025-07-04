import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
  showIcon = true,
}: {
  className?: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  showIcon?: boolean;
}) {
  const sizeVariants = {
    xxs: "text-sm md:text-base",
    xs: "text-base md:text-lg",
    sm: "text-2xl md:text-3xl",
    md: "text-5xl md:text-6xl",
    lg: "text-6xl md:text-7xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <svg
          viewBox="0 0 100 100"
          className="w-5 h-5 md:w-6 md:h-6 text-purple-600"
          fill="currentColor"
        >
          <rect x="0" y="40" width="10" height="20" rx="1" />
          <rect x="20" y="30" width="10" height="40" rx="1" />
          <rect x="40" y="10" width="10" height="80" rx="1" />
          <rect x="60" y="30" width="10" height="40" rx="1" />
          <rect x="80" y="40" width="10" height="20" rx="1" />
        </svg>
      )}

      <h1 className={`font-bold tracking-tight ${sizeVariants[size]}`}>
        <span className="text-foreground">PR</span>
        <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
          GRM
        </span>
      </h1>
    </div>
  );
}
