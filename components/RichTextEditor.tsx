import { cn } from "@/lib/utils";

type Props = {
  html: string;
  className?: string;
  truncate?: boolean;
};

export const RichTextRenderer = ({
  html,
  className = "",
  truncate = false,
}: Props) => {
  return (
    <div
      className={cn(
        "text-sm leading-[1.6] text-muted-foreground space-y-2",
        "[&_p]:my-1",
        "[&_ul]:pl-5 [&_ul]:list-disc",
        "[&_li]:mt-0.5 [&_li]:leading-snug",
        "[&_strong]:font-semibold",
        "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4",
        "[&_hr]:my-3",
        truncate && "line-clamp-3",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
