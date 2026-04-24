"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AboutSectionProps {
  userId: string;
}

export const AboutSection = (props: AboutSectionProps) => {
  return (
    <Suspense fallback={<AboutSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <AboutSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const AboutSectionSkeleton = () => (
  <div className="space-y-2 max-w-2xl">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

const AboutSectionSuspense = ({ userId }: AboutSectionProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });
  const { isAdmin } = useIsAdmin();
  const utils = trpc.useUtils();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user.description ?? "");

  const update = trpc.users.updateChannel.useMutation({
    onSuccess: () => {
      utils.users.getOne.invalidate({ id: userId });
      toast.success("Channel updated");
      setEditing(false);
    },
    onError: (err) => toast.error(err.message ?? "Failed to update"),
  });

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Description</h2>
        {isAdmin && !editing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDraft(user.description ?? "");
              setEditing(true);
            }}
          >
            Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            placeholder="Tell visitors about your channel..."
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={update.isPending}
              onClick={() =>
                update.mutate({ description: draft.trim() || null })
              }
            >
              {update.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={update.isPending}
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : user.description ? (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {user.description}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No description yet.
        </p>
      )}

      <div className="mt-6 pt-6 border-t text-sm text-muted-foreground space-y-1">
        <div>
          <span className="font-medium text-foreground">Videos: </span>
          {user.videoCount}
        </div>
        <div>
          <span className="font-medium text-foreground">Joined: </span>
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
