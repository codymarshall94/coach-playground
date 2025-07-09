import { Navbar } from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Navbar user={user.user} />
      {children}
    </div>
  );
}
