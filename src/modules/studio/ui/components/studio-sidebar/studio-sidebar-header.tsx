"use client";

import Link from "next/link";

import { trpc } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { SidebarHeader, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

export const StudioSidebarHeader = () => {
  const { state } = useSidebar();
  const { ownerId } = useIsAdmin();
  const { data: user } = trpc.users.getOne.useQuery(
    { id: ownerId ?? "" },
    { enabled: Boolean(ownerId) },
  );

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    )
  }

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Your profile" asChild>
          <Link prefetch href="/users/current">
            <UserAvatar
              imageUrl={user.imageUrl}
              name={user.name}
              size="xs"
            />
            <span className="text-sm">Your profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href="/users/current">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.name}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">
          Your profile
        </p>
        <p className="text-xs text-muted-foreground">
          {user.name}
        </p>
      </div>
    </SidebarHeader>
  );
};
