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
      className={`prose dark:prose-invert max-w-none ${className} ${
        truncate && "line-clamp-3"
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
