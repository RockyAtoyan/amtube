import { cn, getChannelLogoLetters } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth.store";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FileInput } from "@/shared/ui/input";

import { FC } from "react";

import Image from "next/image";

interface Props {
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
}

const ChannelSettingsAvatar: FC<Props> = ({ avatarFile, setAvatarFile }) => {
  const { user } = useAuthStore();

  return (
    <div>
      <p className="text-lg mb-">Channel's Avatar</p>
      <p className="text-sm text-primary/70 mb-5">
        Avatar is shown next to your videos or comments on YouTube, for example.
      </p>
      <div className="flex gap-5">
        <div className="h-50 flex-shrink-0 aspect-video rounded-md overflow-hidden border border-border flex items-center justify-center">
          <div
            className={cn(
              "block w-1/3 aspect-square rounded-[15%] overflow-hidden flex items-center justify-center",
              !avatarFile && "bg-primary",
            )}
          >
            {avatarFile && (
              <Image
                src={URL.createObjectURL(avatarFile)}
                alt="Avatar"
                width={100}
                height={100}
                className="w-full h-full object-cover object-center"
              />
            )}
            {!avatarFile && user?.channel?.avatarUrl && (
              <Image
                src={
                  `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
                  user.channel.avatarUrl
                }
                alt="Avatar"
                width={100}
                height={100}
                className="w-full h-full object-cover object-center"
              />
            )}
            {!avatarFile && !user?.channel?.avatarUrl && (
              <span className="font-semibold text-6xl text-background">
                {getChannelLogoLetters(user!.channel!.title)}
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <FileInput
              accept="image/*"
              placeholder="Select avatar"
              onFileSelect={(file) => setAvatarFile(file)}
              className="h-10 py-2 px-4"
            />
            {avatarFile && (
              <Button
                onClick={() => setAvatarFile(null)}
                type="button"
                variant="secondary"
              >
                Clear avatar
              </Button>
            )}
          </div>
          <Badge className="mt-4" variant="info">
            The image should preferably be 1 by 1
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettingsAvatar;
