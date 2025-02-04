import { ResultsSectionSkeleton } from "@/modules/search/ui/sections/results-section";
import { CategoriesSectionSkeleton } from "@/modules/search/ui/sections/categories-section";

const Loading = () => {
  return ( 
    <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSectionSkeleton />
      <ResultsSectionSkeleton />
    </div>
   );
}
 
export default Loading;