import { CategoriesSectionSkeleton } from "@/modules/home/ui/sections/categories-section";
import { HomeVideosSectionSkeleton } from "@/modules/home/ui/sections/home-videos-section";

const Loading = () => {
  return ( 
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <CategoriesSectionSkeleton />
      <HomeVideosSectionSkeleton />
    </div>
   );
}
 
export default Loading;