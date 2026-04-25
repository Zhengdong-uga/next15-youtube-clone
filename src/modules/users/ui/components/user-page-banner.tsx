import { useState } from "react";
import { Edit2Icon } from "lucide-react";

import { useIsAdmin } from "@/hooks/use-is-admin";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { UserGetOneOutput } from "../../types";
import { BannerUploadModal } from "./banner-upload-modal";

interface UserPageBannerProps {
  user: UserGetOneOutput;
};

export const UserPageBannerSkeleton = () => {
  return <Skeleton className="w-full h-[120px] md:h-[172px] rounded-xl" />
};

export const UserPageBanner = ({ user: _user }: UserPageBannerProps) => {
  const { isAdmin } = useIsAdmin();
  const user = _user;
  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);

  return (
    <div className="relative group">
      <BannerUploadModal
        userId={user.id}
        open={isBannerUploadModalOpen}
        onOpenChange={setIsBannerUploadModalOpen}
      />
      <div className={cn(
        "w-full h-[120px] md:h-[172px] rounded-xl",
        user.bannerUrl ? "bg-cover bg-center" : "bg-gradient-to-r from-gray-100 to-gray-200"
      )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {isAdmin && (
          <Button
            onClick={() => setIsBannerUploadModalOpen(true)}
            type="button"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Edit2Icon className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};
