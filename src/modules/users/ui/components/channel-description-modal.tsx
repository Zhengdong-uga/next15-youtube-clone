"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UserGetOneOutput } from "../../types";

interface ChannelDescriptionModalProps {
  user: UserGetOneOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChannelDescriptionModal = ({
  user,
  open,
  onOpenChange,
}: ChannelDescriptionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {user.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-2">Description</h3>
            {user.description ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {user.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description available.
              </p>
            )}
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-base font-semibold mb-3">More info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Videos:</span>
                <span>{user.videoCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Joined:</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
