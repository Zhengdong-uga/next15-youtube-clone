import Link from "next/link";
import { useState } from "react";
import { Camera, CheckCircle2 } from "lucide-react";

import { useIsAdmin } from "@/hooks/use-is-admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

import { UserGetOneOutput } from "../../types";
import { ChannelDescriptionModal } from "./channel-description-modal";
import { AvatarUploadModal } from "./avatar-upload-modal";

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

interface LinkItem {
  title: string;
  url: string;
}

export const UserPageInfoSkeleton = () => {
  return (
    <div className="flex items-start gap-4 md:gap-6 pt-4 md:pt-6">
      <Skeleton className="h-[72px] w-[72px] md:h-[160px] md:w-[160px] rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 pt-1 md:pt-2">
        <Skeleton className="h-7 w-48 md:h-9 md:w-64" />
        <Skeleton className="h-4 w-48 mt-2" />
        <Skeleton className="h-4 w-72 mt-2" />
        <Skeleton className="h-9 w-28 mt-4 rounded-full" />
      </div>
    </div>
  );
};

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const { isAdmin, isLoaded } = useIsAdmin();
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const links = (user.links ?? []) as LinkItem[];
  const firstLink = links[0];
  const remainingCount = links.length - 1;

  return (
    <>
      <ChannelDescriptionModal
        user={user}
        open={showDescriptionModal}
        onOpenChange={setShowDescriptionModal}
      />
      <AvatarUploadModal
        userId={user.id}
        open={showAvatarModal}
        onOpenChange={setShowAvatarModal}
      />
      <div className="flex items-start gap-4 md:gap-6 pt-4 md:pt-6">
        <div className="relative group flex-shrink-0">
          <UserAvatar
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-[72px] w-[72px] md:h-[160px] md:w-[160px]"
          />
          {isLoaded && isAdmin && (
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </button>
          )}
        </div>
        <div className="flex-1 min-w-0 md:pt-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold truncate">{user.name}</h1>
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
            {user.currentStatus && (
              <Badge variant="secondary" className="text-xs font-medium">
                {user.currentStatus}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mt-0.5">
            <span>@{user.name.toLowerCase().replace(/\s+/g, '')}</span>
            {user.subscriberCount > 0 && (
              <>
                <span>·</span>
                <span>{user.subscriberCount} subscribers</span>
              </>
            )}
            <span>·</span>
            <span>{user.videoCount} videos</span>
          </div>
          {user.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {user.description}
              {"  "}
              <button
                onClick={() => setShowDescriptionModal(true)}
                className="font-semibold text-foreground hover:text-foreground/80 inline"
              >
                ...more
              </button>
            </p>
          )}
          {firstLink && (
            <div className="text-sm mt-0.5 flex items-center gap-1 flex-wrap">
              <a
                href={firstLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {new URL(firstLink.url).hostname.replace(/^www\./, '')}
                {new URL(firstLink.url).pathname !== '/' ? new URL(firstLink.url).pathname : ''}
              </a>
              {remainingCount > 0 && (
                <button
                  onClick={() => setShowDescriptionModal(true)}
                  className="font-semibold text-foreground hover:text-foreground/80"
                >
                  and {remainingCount} more link{remainingCount > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
          <div className="mt-3">
            {!isLoaded ? (
              <Skeleton className="h-9 w-28 rounded-full" />
            ) : isAdmin ? (
              <Button
                variant="secondary"
                asChild
                className="rounded-full"
              >
                <Link prefetch href="/studio">Go to studio</Link>
              </Button>
            ) : (
              <Button
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4"
              >
                Subscribe
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
