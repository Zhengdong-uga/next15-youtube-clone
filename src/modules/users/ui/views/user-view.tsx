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

      <div className="border-b mt-4">
        <div className="flex items-center gap-8 px-4 md:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "py-3 px-1 text-sm font-medium transition-colors relative uppercase tracking-wide",
                tab === t.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-foreground" />
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
