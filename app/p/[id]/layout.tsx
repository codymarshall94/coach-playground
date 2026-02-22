import { Navbar } from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function PublicProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div>
      <Navbar user={user.user ?? null} />
      {children}
    </div>
  );
}
