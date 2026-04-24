"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { Separator } from "@/components/ui/separator";

import { UserPageInfo, UserPageInfoSkeleton } from "../components/user-page-info";
import { UserPageBanner, UserPageBannerSkeleton } from "../components/user-page-banner";

interface UserSectionProps {
  userId: string;
};

export const UserSection = (props: UserSectionProps) => {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <UserSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const UserSectionSkeleton = () => {
  return (
    <div className="flex flex-col">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
      <Separator />
    </div>
  );
};

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

  return (
    <div className="flex flex-col -mx-4">
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
    </div>
  );
};

