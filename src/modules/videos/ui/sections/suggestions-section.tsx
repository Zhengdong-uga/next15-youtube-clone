"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";

import { VideoGridCard, VideoGridCardSkeleton } from "../components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "../components/video-row-card";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
};

export const SuggestionsSection = ({
  videoId,
  isManual,
}: SuggestionsSectionProps) => {
  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  )
}

export const SuggestionsSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  )
}

const SuggestionsSectionSuspense = ({
  videoId,
  isManual,
}: SuggestionsSectionProps) => {
  const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
    videoId,
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allItems = suggestions.pages.flatMap((page) => page.items);
  const firstCreator = allItems[0]?.user;
  const hasCreatorVideos = firstCreator && allItems.some((v) => v.userId === firstCreator.id);

  return (
    <>
      {hasCreatorVideos && firstCreator && (
        <div className="hidden md:block mb-3">
          <p className="text-sm font-semibold">
            More from {firstCreator.name}
          </p>
        </div>
      )}
      <div className="hidden md:block space-y-3">
        {allItems.map((video) => (
          <VideoRowCard
            key={video.id}
            data={video}
            size="compact"
          />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) => page.items.map((video) => (
          <VideoGridCard
            key={video.id}
            data={video}
          />
        )))}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};
