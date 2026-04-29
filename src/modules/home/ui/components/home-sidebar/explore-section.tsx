"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ShoppingBagIcon,
  MusicIcon,
  FilmIcon,
  GamepadIcon,
  NewspaperIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RadioIcon,
  TrophyIcon,
  LightbulbIcon,
  ShirtIcon,
} from "lucide-react";

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
    title: "Shopping",
    url: "/feed/shopping",
    icon: ShoppingBagIcon,
  },
  {
    title: "Music",
    url: "/feed/music",
    icon: MusicIcon,
  },
  {
    title: "Movies & TV",
    url: "/feed/movies",
    icon: FilmIcon,
  },
  {
    title: "Live",
    url: "/feed/live",
    icon: RadioIcon,
  },
  {
    title: "Gaming",
    url: "/feed/gaming",
    icon: GamepadIcon,
  },
  {
    title: "News",
    url: "/feed/news",
    icon: NewspaperIcon,
  },
  {
    title: "Sports",
    url: "/feed/sports",
    icon: TrophyIcon,
  },
  {
    title: "Learning",
    url: "/feed/learning",
    icon: LightbulbIcon,
  },
  {
    title: "Fashion & Beauty",
    url: "/feed/fashion",
    icon: ShirtIcon,
  },
];

export const ExploreSection = () => {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const visibleItems = showMore ? items : items.slice(0, 3);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Explore</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => (
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
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setShowMore(!showMore)}
            >
              <div className="flex items-center gap-4">
                {showMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
                <span className="text-sm">{showMore ? "Show less" : "Show more"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
