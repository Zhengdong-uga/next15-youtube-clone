import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
};

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Subscribed");
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: userId });

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");

      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/admin/login");
      }
    },
  });
  
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success("Subscribed");
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: userId });

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");

      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/admin/login");
      }
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return {
    isPending,
    onClick,
  };
};
