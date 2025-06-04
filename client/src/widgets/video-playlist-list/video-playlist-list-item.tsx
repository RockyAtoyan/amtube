"use client";

import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn } from "@/shared/lib";

import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

interface Props {
  video: VideoWithRelations;
  playlist: PlaylistWithRelations;
  isActive?: boolean;
}

const VideoPlaylistListItem: FC<Props> = ({ video, playlist, isActive }) => {
  return (
    <div
      id={video.publicId}
      className={cn(
        "w-full overflow-hidden flex gap-3 relative pl-2 py-2",
        isActive && "bg-accent-secondary/30",
      )}
    >
      <Link
        href={PublicRoutes.VIDEO(video.publicId, playlist.id)}
        className="block rounded-lg w-full max-w-[8rem] aspect-video relative bg-secondary flex-shrink-0 dark:bg-black user-select-none"
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
          href={PublicRoutes.VIDEO(video.publicId, playlist.id)}
          className="mt-2 text-lg text-primary line-clamp-1 overflow-hidden"
        >
          {video.title}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-4 text-sm text-primary/60">
          <Link
            className="line-clamp-1 max-w-full text-primary/60 transition-colors hover:text-primary/90"
            href={PublicRoutes.CHANNEL(video.channel.slug)}
          >
            {video.channel.title}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaylistListItem;
