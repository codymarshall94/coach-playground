export function HelpArticle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="prose dark:prose-invert max-w-3xl">
      <h1>{title}</h1>
      <div className="prose prose-neutral dark:prose-invert">{children}</div>
    </div>
  );
}
