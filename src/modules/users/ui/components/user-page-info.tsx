import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { useIsAdmin } from "@/hooks/use-is-admin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

import { UserGetOneOutput } from "../../types";
import { ChannelDescriptionModal } from "./channel-description-modal";

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export const UserPageInfoSkeleton = () => {
  return (
    <div className="-mt-12 md:-mt-16 px-4 md:px-6">
      <div className="flex items-start gap-4 md:gap-6">
        <Skeleton className="h-20 w-20 md:h-32 md:w-32 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0 pt-2 md:pt-4">
          <Skeleton className="h-7 w-48 md:h-9 md:w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
          <Skeleton className="h-4 w-64 mt-1" />
          <Skeleton className="h-9 w-28 mt-4 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const { isAdmin, isLoaded } = useIsAdmin();
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  return (
    <>
      <ChannelDescriptionModal
        user={user}
        open={showDescriptionModal}
        onOpenChange={setShowDescriptionModal}
      />
      <div className="-mt-12 md:-mt-16 px-4 md:px-6 pb-4">
        <div className="flex items-start gap-4 md:gap-6">
          <UserAvatar
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-20 w-20 md:h-32 md:w-32 border-4 border-white flex-shrink-0"
          />
          <div className="flex-1 min-w-0 pt-2 md:pt-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-4xl font-bold truncate">{user.name}</h1>
              <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>@{user.name.toLowerCase().replace(/\s+/g, '')}</span>
              <span>•</span>
              <span>{user.videoCount} videos</span>
            </div>
            {user.description && (
              <div className="text-sm text-muted-foreground mt-2">
                <p className="line-clamp-2 inline">{user.description}</p>
                {user.description.length > 100 && (
                  <>
                    {" "}
                    <button
                      onClick={() => setShowDescriptionModal(true)}
                      className="font-medium text-foreground hover:text-foreground/80"
                    >
                      ...more
                    </button>
                  </>
                )}
              </div>
            )}
            <div className="mt-4">
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
                  variant="default"
                  className="rounded-full bg-black hover:bg-black/90 text-white"
                  disabled
                >
                  Subscribe
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
