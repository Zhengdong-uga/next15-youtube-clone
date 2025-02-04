import { VideoSectionSkeleton } from "@/modules/videos/ui/sections/video-section";
import { CommentsSectionSkeleton } from "@/modules/videos/ui/sections/comments-section";
import { SuggestionsSectionSkeleton } from "@/modules/videos/ui/sections/suggestions-section";

const Loading = () => {
  return ( 
    <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoSectionSkeleton />
          <div className="xl:hidden block mt-4">
            <SuggestionsSectionSkeleton />
          </div>
          <CommentsSectionSkeleton />
        </div>
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionsSectionSkeleton />
        </div>
      </div>
    </div>
   );
}
 
export default Loading;