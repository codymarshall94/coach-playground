"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import AvatarDropdown from "@/features/workout-builder/components/AvatarDropdown";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Menu, Plus, Dumbbell, Home, UserIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/programs", label: "Programs", icon: Dumbbell },
];

export function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isBuilderPage = pathname.includes("/programs/builder");
  const isProgramPage = pathname.includes("/programs/");

  if (isBuilderPage || isProgramPage) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Logo size="xs" showIcon />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className="text-sm font-medium"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Button size="sm" className="font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Program
          </Button>

          {user ? (
            <AvatarDropdown />
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="px-2">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center space-x-2 pb-6">
                <Logo size="xs" showIcon />
              </div>

              {/* Navigation */}
              <nav className="flex flex-col space-y-1 flex-1">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start text-base font-medium h-12"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}

                <Separator className="my-4" />

                <Button className="w-full justify-start text-base font-medium h-12">
                  <Plus className="w-5 h-5 mr-3" />
                  New Program
                </Button>
              </nav>

              {/* Mobile User Section */}
              <div className="pt-6 border-t">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Signed in
                        </p>
                      </div>
                    </div>

                    <Link href="/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <UserIcon className="w-4 h-4 mr-3" />
                        Profile
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
