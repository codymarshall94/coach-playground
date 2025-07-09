"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AvatarDropdown from "@/features/workout-builder/components/AvatarDropdown";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

export function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isBuilderPage = pathname.includes("/programs/builder");
  const isProgramPage = pathname.includes("/programs/");

  if (isBuilderPage || isProgramPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <Logo size="xs" showIcon />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">Create</span>
          </Button>

          {user ? (
            <AvatarDropdown />
          ) : (
            <Link href="/login">
              <Button size="sm" className="text-sm font-semibold">
                Log In
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="sm:hidden">
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/">Home</Link>
              {user ? (
                <>
                  <Link href="/profile">Profile</Link>
                  <button
                    onClick={() =>
                      supabase.auth.signOut().then(() => {
                        router.refresh();
                      })
                    }
                    className="text-sm text-red-500 mt-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-blue-600 font-medium">
                  Log In
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
