import { UserSectionSkeleton } from "@/modules/users/ui/sections/user-section";
import { VideosSectionSkeleton } from "@/modules/users/ui/sections/videos-section";

const Loading = () => {
  return ( 
    <div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6">
      <UserSectionSkeleton />
      <VideosSectionSkeleton />
    </div>
  );
}
 
export default Loading;