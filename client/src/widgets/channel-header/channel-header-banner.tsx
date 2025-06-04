import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations";
import { cn, getChannelLogoLetters } from "@/shared/lib";

import { FC } from "react";

import Image from "next/image";

interface Props {
  channel: ChannelWithRelations;
}

const ChannelHeaderBanner: FC<Props> = ({ channel }) => {
  return (
    <div className="mb-5 w-full aspect-[25/4] flex-shrink-0 rounded-md overflow-hidden border border-border flex items-center justify-center">
      <div
        className={cn(
          "w-full h-full overflow-hidden flex items-center justify-center",
        )}
      >
        {channel.bannerUrl && (
          <Image
            src={
              `${process.env.NEXT_PUBLIC_API_URL}/uploads` + channel.bannerUrl
            }
            alt="Avatar"
            width={2650}
            height={423}
            className="w-full h-full object-cover object-center"
          />
        )}
        {!channel.bannerUrl && (
          <span className="text-6xl">
            {getChannelLogoLetters(channel.title)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChannelHeaderBanner;
