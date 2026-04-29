"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { UserSection } from "../sections/user-section";
import { VideosSection } from "../sections/videos-section";
import { AboutSection } from "../sections/about-section";

interface UserViewProps {
  userId: string;
}

type Tab = "home" | "videos" | "about";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "about", label: "About" },
];

export const UserView = ({ userId }: UserViewProps) => {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10">
      <UserSection userId={userId} />

      <div className="border-b mt-2">
        <div className="flex items-center gap-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "h-[48px] px-6 text-sm font-medium transition-colors relative inline-flex items-center",
                tab === t.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-foreground rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {tab === "home" && <VideosSection userId={userId} />}
        {tab === "videos" && <VideosSection userId={userId} />}
        {tab === "about" && <AboutSection userId={userId} />}
      </div>
    </div>
  );
};
