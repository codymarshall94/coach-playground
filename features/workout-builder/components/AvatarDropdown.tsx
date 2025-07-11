"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ChevronDown, ListOrdered, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

export default function AvatarDropdown() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();

  const { email } = user?.user_metadata ?? {};

  if (!profile) return <Skeleton className="w-10 h-10 rounded-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.full_name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 -right-1.5 bg-background border border-border rounded-full p-1">
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-2" align="end">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-14 h-14">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.full_name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <Button className="w-full" onClick={() => router.push("/programs/new")}>
          Create Program
        </Button>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/programs">
            <ListOrdered className="w-4 h-4 mr-2" />
            My Programs
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <form action="/auth/signout" method="post">
            <button className="flex items-center w-full" type="submit">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
