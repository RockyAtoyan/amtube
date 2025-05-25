"use client";

import { PublicRoutes } from "@/shared/config/routes/public.routes";
import {
  cn,
  formatDateRelative,
  formatNumber,
  getChannelLogoLetters,
} from "@/shared/lib";
import { Skeleton } from "@/shared/ui/skeleton";

import { FC } from "react";

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { VideoWithRelations } from "../../model/video-with-relations";

interface Props {
  video: VideoWithRelations;
}

const VideoCard: FC<Props> = ({ video }) => {
  const router = useRouter();

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <Link
        href={PublicRoutes.VIDEO(video.publicId)}
        className="block rounded-lg w-full aspect-video relative bg-secondary dark:bg-black user-select-none"
        title={video.title}
      >
        <Image
          src={
            video.thumbnailUrl
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
                video.thumbnailUrl?.replace(/\\/g, "/")
              : "/thumbnail.webp"
          }
          alt={video.title}
          width={224}
          height={126}
          className={cn(
            "w-full h-full object-contain object-center rounded-lg",
            !video.thumbnailUrl && "object-cover",
          )}
        />
        <span
          className="w-8 h-8 rounded-full bg-white absolute bottom-[8%] left-[5%] overflow-hidden flex items-center justify-center transition-all hover:scale-[1.1]"
          title={video.channel.title}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            router.push(PublicRoutes.CHANNEL(video.channel.slug));
          }}
        >
          {video.channel.avatarUrl && (
            <Image
              src={
                `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
                video.channel.avatarUrl
              }
              alt={video.channel.slug}
              width={48}
              height={48}
              className="w-full h-full object-fit object-cover"
            />
          )}
          {!video.channel.avatarUrl && (
            <span className="font-semibold text-base text-black">
              {getChannelLogoLetters(video.channel.title)}
            </span>
          )}
        </span>
      </Link>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-primary/60">
        <span title="views" className="flex items-center gap-2">
          <User size={16} className="text-accent" />
          {formatNumber(video.views.length)} views
        </span>
        <span title="date">{formatDateRelative(video.updatedAt)}</span>
      </div>
      <Link
        href={PublicRoutes.VIDEO(video.publicId)}
        className="mt-2 text-base text-primary line-clamp-2 overflow-hidden"
      >
        {video.title}
      </Link>
      <Link
        className="line-clamp-1 mt-1 text-sm text-primary/70 transition-colors hover:text-primary/90"
        href={PublicRoutes.CHANNEL(video.channel.slug)}
      >
        {video.channel.title}
      </Link>
    </div>
  );
};

export const VideoCardSkeleton = () => {
  return <Skeleton className="w-full aspect-video" />;
};

export default VideoCard;
