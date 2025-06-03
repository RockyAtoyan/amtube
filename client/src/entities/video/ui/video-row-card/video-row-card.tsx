"use client";

import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn, formatDateRelative, formatNumber } from "@/shared/lib";
import { Skeleton } from "@/shared/ui/skeleton";

import { FC } from "react";

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { VideoWithRelations } from "../../model/video-with-relations";
import VideoRowCardActions from "./video-row-card-actions";

interface Props {
  video: VideoWithRelations;
  editPlaylistId?: string;
  fromPlaylistId?: string;
  isInStudio?: boolean;
  isInPlaylistList?: boolean;
}

const VideoRowCard: FC<Props> = ({
  video,
  editPlaylistId,
  fromPlaylistId,
  isInStudio,
  isInPlaylistList,
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden flex gap-3 relative">
      <Link
        href={PublicRoutes.VIDEO(video.publicId, fromPlaylistId)}
        className="block rounded-lg w-full max-w-[20rem] aspect-video relative bg-secondary dark:bg-black user-select-none"
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
      </Link>
      <div>
        <Link
          href={PublicRoutes.VIDEO(video.publicId, fromPlaylistId)}
          className="mt-2 text-lg text-primary line-clamp-2 overflow-hidden"
        >
          {video.title}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-4 text-sm text-primary/60">
          <Link
            className="line-clamp-1 max-w-56 text-primary/60 transition-colors hover:text-primary/90"
            href={PublicRoutes.CHANNEL(video.channel.slug)}
          >
            {video.channel.title}
          </Link>
          <span title="views" className="flex items-center gap-1">
            <User size={16} className="text-accent" />
            {formatNumber(video.views.length)} views
          </span>
          <span title="date">{formatDateRelative(video.updatedAt)}</span>
        </div>
      </div>
      {!isInPlaylistList && (
        <div className="absolute top-0 right-0">
          <VideoRowCardActions
            editPlaylistId={editPlaylistId}
            isInStudio={isInStudio}
            video={video}
          />
        </div>
      )}
    </div>
  );
};

export const VideoRowCardSkeleton = () => {
  return <Skeleton className="w-full max-w-[20rem] aspect-video" />;
};

export default VideoRowCard;
