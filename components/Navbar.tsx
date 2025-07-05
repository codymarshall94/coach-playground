"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "My Programs" },
  { href: "/programs/new", label: "Create" },
];

export function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          <Logo size="xs" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition hover:text-black",
                pathname === link.href ? "text-black" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={user?.avatar_url} /> */}
                    <AvatarFallback>{user?.email?.[0] ?? "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/u">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      size="sm"
                      className="text-sm font-semibold"
                      onClick={() =>
                        supabase.auth.signOut().then(() => {
                          router.refresh();
                        })
                      }
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium"
                >
                  {link.label}
                </Link>
              ))}
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
