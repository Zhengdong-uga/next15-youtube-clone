"use client";

import Image from "next/image";
import {
  Briefcase,
  Globe,
  GraduationCap,
  Info,
  Mail,
  Play,
  Share2,
  Signal,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { UserGetOneOutput } from "../../types";

interface ChannelDescriptionModalProps {
  user: UserGetOneOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
};

export const ChannelDescriptionModal = ({
  user,
  open,
  onOpenChange,
}: ChannelDescriptionModalProps) => {
  const links = (user.links ?? []) as { title: string; url: string }[];
  const skills = (user.skills ?? []) as string[];

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({ title: user.name, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {user.name}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto max-h-[70vh] px-6 pb-6">
          {user.description && (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pb-4">
              {user.description}
            </p>
          )}

          {skills.length > 0 && (
            <div className="py-4 border-t">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div className="py-4 border-t space-y-1">
              {links.map((link, i) => {
                const favicon = getFaviconUrl(link.url);
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 py-2 rounded-lg hover:bg-accent/50 -mx-2 px-2 transition-colors"
                  >
                    {favicon ? (
                      <Image
                        src={favicon}
                        alt={link.title}
                        width={24}
                        height={24}
                        className="rounded-full flex-shrink-0"
                        unoptimized
                      />
                    ) : (
                      <Globe className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{link.title}</p>
                      <p className="text-xs text-blue-600 truncate">
                        {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          <div className="py-4 border-t">
            <h3 className="text-base font-bold mb-4">More info</h3>
            <div className="space-y-5 text-sm">
              {user.currentStatus && (
                <div className="flex items-center gap-4">
                  <Briefcase className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <span>{user.currentStatus}</span>
                </div>
              )}
              {user.contactEmail && (
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`mailto:${user.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {user.contactEmail}
                  </a>
                </div>
              )}
              {user.education && (
                <div className="flex items-center gap-4">
                  <GraduationCap className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <span>{user.education}</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Globe className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span>{user.location ?? (typeof window !== 'undefined' ? window.location.origin : '')}</span>
              </div>
              <div className="flex items-center gap-4">
                <Info className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              {user.subscriberCount > 0 && (
                <div className="flex items-center gap-4">
                  <Users className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <span>{user.subscriberCount.toLocaleString()} subscribers</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Play className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span>{user.videoCount.toLocaleString()} videos</span>
              </div>
              <div className="flex items-center gap-4">
                <Signal className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                <span>{typeof window !== 'undefined' ? window.location.origin : ''}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 pb-1">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share channel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
