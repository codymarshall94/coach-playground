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
import {
  ExternalLink,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Plus,
  Settings,
  User2,
} from "lucide-react";
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
        <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 p-0 rounded-2xl shadow-xl border-border/40 overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* ── Identity header ── */}
        <div className="bg-gradient-to-br from-primary/8 to-transparent px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              {profile?.username && (
                <p className="text-[11px] text-muted-foreground truncate">
                  @{profile.username}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── New Program CTA ── */}
        <div className="px-3 pt-2 pb-1">
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <Link
              href="/programs/builder"
              className="flex items-center gap-2.5 w-full rounded-xl bg-primary px-3.5 py-2.5 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-semibold">New Program</p>
                <p className="text-[10px] opacity-75">Start building</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </div>

        {/* ── Navigation ── */}
        <div className="px-1.5 py-1">
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] h-9 gap-2.5 px-3">
            <Link href="/programs">
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
              My Programs
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] h-9 gap-2.5 px-3">
            <Link href="/profile">
              <User2 className="w-4 h-4 text-muted-foreground" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] h-9 gap-2.5 px-3">
            <Link href="/profile/settings">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
        </div>

        <div className="h-px bg-border/50 mx-3" />

        {/* ── Utilities ── */}
        <div className="px-1.5 py-1">
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-[13px] h-9 gap-2.5 px-3">
            <Link href="/help" target="_blank">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              Help & FAQ
              <ExternalLink className="w-2.5 h-2.5 ml-auto text-muted-foreground/40" />
            </Link>
          </DropdownMenuItem>

          <div className="flex items-center justify-between rounded-lg px-3 h-9">
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-[13px]">Theme</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="h-px bg-border/50 mx-3" />

        {/* ── Sign out ── */}
        <div className="px-1.5 pt-1 pb-1.5">
          <DropdownMenuItem
            className="cursor-pointer rounded-lg text-[13px] h-9 gap-2.5 px-3 text-muted-foreground hover:text-destructive focus:text-destructive focus:bg-destructive/8"
            asChild
          >
            <form action="/auth/signout" method="post">
              <button className="flex items-center gap-2.5 w-full" type="submit">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
