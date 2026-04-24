"use client";

import { useIsAdmin } from "@/hooks/use-is-admin";
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"

import { MainSection } from "./main-section"
import { PersonalSection } from "./personal-section"
import { SubscriptionsSection } from "./subscriptions-section"

export const HomeSidebar = () => {
  const { isAdmin, isLoaded } = useIsAdmin();
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        {isLoaded && isAdmin && (
          <>
            <Separator />
            <PersonalSection />
            <Separator />
            <SubscriptionsSection />
          </>
        )}
      </SidebarContent>
    </Sidebar>
  )
}