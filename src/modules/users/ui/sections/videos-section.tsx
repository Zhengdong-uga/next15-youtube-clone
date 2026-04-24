"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";

import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";

interface VideosSectionProps {
  userId: string;
}

type SortOption = "latest" | "popular" | "oldest";

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "latest", label: "Latest" },
  { id: "popular", label: "Popular" },
  { id: "oldest", label: "Oldest" },
];

export const VideosSection = (props: VideosSectionProps) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const VideosSectionSkeleton = () => {
  return (
    <div>
      <div className="flex gap-2 mb-6">
        {SORT_OPTIONS.map((option) => (
          <div key={option.id} className="h-8 w-20 bg-muted rounded-full" />
        ))}
      </div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const VideosSectionSuspense = ({ userId }: VideosSectionProps) => {
  const [sort, setSort] = useState<SortOption>("latest");

  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    { userId, limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const sortedVideos = videos.pages
    .flatMap((page) => page.items)
    .sort((a, b) => {
      if (sort === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return (b.viewCount || 0) - (a.viewCount || 0);
      }
    });

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => setSort(option.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              sort === option.id
                ? "bg-foreground text-background"
                : "bg-muted hover:bg-muted/80 text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {sortedVideos.map((video) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};