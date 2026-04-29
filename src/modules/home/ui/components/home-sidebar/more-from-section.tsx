"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ZapIcon, FlagIcon } from "lucide-react";

import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";

const items = [
  {
    title: "CaseTube Premium",
    url: "/premium",
    icon: ZapIcon,
  },
  {
    title: "CaseTube Studio",
    url: "/studio",
    icon: FlagIcon,
  },
];

export const MoreFromSection = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>More from CaseTube</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
              >
                <Link prefetch href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
