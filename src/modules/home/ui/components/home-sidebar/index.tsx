"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useIsAdmin } from "@/hooks/use-is-admin";
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar"

import { MainSection } from "./main-section"
import { SignInSection } from "./signin-section"
import { PersonalSection } from "./personal-section"
import { SubscriptionsSection } from "./subscriptions-section"
import { ExploreSection } from "./explore-section"
import { MoreFromSection } from "./more-from-section"

export const HomeSidebar = () => {
  const { isAdmin, isLoaded } = useIsAdmin();
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const prevPathRef = useRef(pathname);

  const isVideoPage = pathname.startsWith("/videos/");

  useEffect(() => {
    const wasVideoPage = prevPathRef.current.startsWith("/videos/");
    prevPathRef.current = pathname;

    if (isVideoPage && !wasVideoPage) {
      setOpen(false);
    } else if (!isVideoPage && wasVideoPage) {
      setOpen(true);
    }
  }, [pathname, isVideoPage, setOpen]);

  return (
    <Sidebar
      className="pt-16 z-40 border-none"
      collapsible={isVideoPage ? "offcanvas" : "icon"}
    >
      <SidebarContent className="bg-background">
        <MainSection />
        {isLoaded && !isAdmin && (
          <>
            <Separator />
            <SignInSection />
          </>
        )}
        {isLoaded && isAdmin && (
          <>
            <Separator />
            <PersonalSection />
            <Separator />
            <SubscriptionsSection />
          </>
        )}
        <Separator />
        <ExploreSection />
        <Separator />
        <MoreFromSection />
      </SidebarContent>
    </Sidebar>
  )
}