import { FormSectionSkeleton } from "@/modules/studio/ui/sections/form-section";

const Loading = () => {
  return ( 
    <div className="px-4 pt-2.5 max-w-screen-lg">
      <FormSectionSkeleton />
    </div>
  );
}
 
export default Loading;