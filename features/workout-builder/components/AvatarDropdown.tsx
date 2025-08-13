"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ChevronDown, ExternalLink, ListOrdered, LogOut } from "lucide-react";
import Link from "next/link";

export default function AvatarDropdown() {
  const { profile } = useUserProfile();

  if (!profile) return <Skeleton className="w-10 h-10 rounded-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="text-xl bg-gradient-to-br from-brand to-brand-foreground text-foreground">
              {profile?.full_name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 -right-1.5 bg-background border border-border rounded-full p-1">
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 p-0 bg-popover text-popover-foreground"
        align="end"
        side="bottom"
      >
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="text-xl bg-gradient-to-br from-brand to-brand-foreground text-foreground">
                {profile?.full_name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {profile?.full_name || "User"}
              </h3>
              <p className="text-sm text-muted-foreground">See your profile</p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-2">
          <DropdownMenuItem
            className="cursor-pointer h-12 px-4 rounded-lg text-foreground"
            asChild
          >
            <Link href="/programs">
              <ListOrdered className="w-5 h-5 mr-3 text-muted-foreground" />
              <span className="font-medium">My Programs</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <div className="p-2">
          <div className="flex items-center justify-between h-12 px-4 rounded-lg hover:bg-muted/50">
            <span className="font-medium">Theme</span>
            <ThemeToggle />
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <div className="p-2">
          <DropdownMenuItem
            className="cursor-pointer h-12 px-4 rounded-lg text-destructive focus:text-destructive hover:bg-destructive/10"
            asChild
          >
            <form action="/auth/signout" method="post">
              <button className="flex items-center w-full" type="submit">
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Log Out</span>
              </button>
            </form>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <div className="p-4 pt-2">
          <Link
            target="_blank"
            href="/help"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Questions?</span>
            <span className="text-blue-600 font-medium flex items-center gap-1">
              FAQ
              <ExternalLink className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
