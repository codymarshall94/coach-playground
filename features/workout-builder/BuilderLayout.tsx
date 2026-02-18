import { ReactNode } from "react";

interface BuilderLayoutProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  modals?: ReactNode;
}

export function BuilderLayout({
  header,
  sidebar,
  children,
  modals,
}: BuilderLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      {header ?? null}

      <div className="flex flex-1 overflow-hidden">
        {sidebar ? (
          <aside className="w-full max-w-96 border-r border-border bg-muted/20 p-3 overflow-y-auto">
            {sidebar}
          </aside>
        ) : null}

        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {modals ?? null}
    </div>
  );
}
