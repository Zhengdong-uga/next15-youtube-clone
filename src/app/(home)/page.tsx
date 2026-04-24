import { DEFAULT_LIMIT } from "@/constants";
import { getOwnerUserId } from "@/lib/auth";
import { HydrateClient, trpc } from "@/trpc/server";

import { UserView } from "@/modules/users/ui/views/user-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  const userId = getOwnerUserId();

  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.videos.getMany.prefetchInfinite({ userId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default Page;
