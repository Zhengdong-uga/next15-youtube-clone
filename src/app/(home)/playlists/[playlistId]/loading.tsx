import { PlaylistHeaderSectionSkeleton } from "@/modules/playlists/ui/sections/playlist-header-section";
import { VideosSectionSkeleton } from "@/modules/playlists/ui/sections/videos-section";

const Loading = () => {
  return ( 
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSectionSkeleton />
      <VideosSectionSkeleton />
    </div>
   );
}
 
export default Loading;
