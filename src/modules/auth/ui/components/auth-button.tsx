"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClapperboardIcon, LogOutIcon, UserCircleIcon, UserIcon } from "lucide-react";

import { useIsAdmin } from "@/hooks/use-is-admin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AuthButton = () => {
  const router = useRouter();
  const { isAdmin, isLoaded } = useIsAdmin();

  if (!isLoaded) return null;

  if (isAdmin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium rounded-full shadow-none"
          >
            <UserCircleIcon className="size-4" />
            Admin
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/users/current">
              <UserIcon className="size-4" />
              My profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/studio">
              <ClapperboardIcon className="size-4" />
              Studio
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.refresh();
              router.push("/");
            }}
          >
            <LogOutIcon className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full gap-1"
    >
      <UserCircleIcon className="size-5" />
      Sign in
    </Button>
  );
};
