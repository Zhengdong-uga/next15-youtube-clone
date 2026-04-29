import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ResponsiveModal } from "@/components/responsive-modal";

interface AvatarUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AvatarUploadModal = ({
  userId,
  open,
  onOpenChange,
}: AvatarUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Upload a profile picture"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="avatarUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
