import { Navbar } from "@/components/Navbar";
import { SidebarNav } from "@/features/help/components/SidebarNav";
import { createClient } from "@/utils/supabase/server";

export default async function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-primary from-primary/10 via-primary/5 to-primary/10">
      <Navbar user={user.user ?? null} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r p-4 overflow-y-hidden">
          <SidebarNav />
        </aside>

        <main className="flex-1 overflow-y-auto p-6 ">{children}</main>
      </div>
    </div>
  );
}
