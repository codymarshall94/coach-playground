"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ExternalLink, HelpCircle, ListOrdered, LogOut } from "lucide-react";
import Link from "next/link";

export default function AvatarDropdown() {
  const { profile } = useUserProfile();

  if (!profile) return <Skeleton className="w-8 h-8 rounded-full" />;

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-border transition-all">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-brand to-brand-foreground text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-52 p-1.5 rounded-xl shadow-lg border-border/60"
        align="end"
        sideOffset={8}
      >
        {/* Identity */}
        <div className="px-2.5 pt-1.5 pb-2">
          <p className="text-[13px] font-semibold text-foreground truncate">
            {profile?.full_name || "User"}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {profile?.email ?? ""}
          </p>
        </div>

        <div className="h-px bg-border/60 mx-1 my-1" />

        <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] h-8">
          <Link href="/programs">
            <ListOrdered className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            My Programs
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] h-8">
          <Link href="/help" target="_blank">
            <HelpCircle className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            Help & FAQ
            <ExternalLink className="w-2.5 h-2.5 ml-auto text-muted-foreground/50" />
          </Link>
        </DropdownMenuItem>

        {/* Theme */}
        <div className="flex items-center justify-between rounded-lg px-2 h-8">
          <span className="text-[13px]">Theme</span>
          <ThemeToggle />
        </div>

        <div className="h-px bg-border/60 mx-1 my-1" />

        <DropdownMenuItem
          className="cursor-pointer rounded-lg text-[13px] h-8 text-destructive focus:text-destructive focus:bg-destructive/10"
          asChild
        >
          <form action="/auth/signout" method="post">
            <button className="flex items-center w-full" type="submit">
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
