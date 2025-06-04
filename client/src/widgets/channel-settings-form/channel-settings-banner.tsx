import { cn } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth.store";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FileInput } from "@/shared/ui/input";

import { FC } from "react";

import Image from "next/image";

interface Props {
  bannerFile: File | null;
  setBannerFile: (file: File | null) => void;
}

const ChannelSettingsBanner: FC<Props> = ({ bannerFile, setBannerFile }) => {
  const { user } = useAuthStore();

  return (
    <div>
      <p className="text-lg">Channel's Banner</p>
      <p className="text-sm text-primary/70 mb-5">
        This image is displayed at the top of the channel page.
      </p>
      <div className="flex flex-col gap-5">
        <div className="w-full aspect-[25/4] flex-shrink-0 rounded-md overflow-hidden border border-border flex items-center justify-center">
          <div
            className={cn(
              "w-full h-full overflow-hidden flex items-center justify-center",
            )}
          >
            {bannerFile && (
              <Image
                src={URL.createObjectURL(bannerFile)}
                alt="Avatar"
                width={2650}
                height={423}
                className="w-full h-full object-cover object-center"
              />
            )}
            {!bannerFile && user?.channel?.bannerUrl && (
              <Image
                src={
                  `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
                  user.channel.bannerUrl
                }
                alt="Avatar"
                width={2650}
                height={423}
                className="w-full h-full object-cover object-center"
              />
            )}
            {!bannerFile && !user?.channel?.bannerUrl && (
              <span className="text-lg">No banner.</span>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <FileInput
              accept="image/*"
              placeholder="Select banner"
              onFileSelect={(file) => setBannerFile(file)}
              className="h-10 py-2 px-4"
            />
            {bannerFile && (
              <Button
                onClick={() => setBannerFile(null)}
                type="button"
                variant="secondary"
              >
                Clear banner
              </Button>
            )}
            <Badge variant="info">The image should preferably be 25 by 4</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettingsBanner;
