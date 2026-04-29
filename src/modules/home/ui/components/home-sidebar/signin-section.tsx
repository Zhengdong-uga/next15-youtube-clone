"use client";

import Link from "next/link";
import { UserCircleIcon } from "lucide-react";

import { useIsAdmin } from "@/hooks/use-is-admin";
import { 
  SidebarGroup, 
  SidebarGroupContent, 
} from "@/components/ui/sidebar";

export const SignInSection = () => {
  const { isAdmin, isLoaded } = useIsAdmin();

  if (!isLoaded || isAdmin) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-2">
          <p className="text-sm text-muted-foreground leading-snug">
            Sign in to like videos, comment, and subscribe.
          </p>
          <Link
            href="/admin/login"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-500/50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <UserCircleIcon className="h-5 w-5" />
            Sign in
          </Link>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
