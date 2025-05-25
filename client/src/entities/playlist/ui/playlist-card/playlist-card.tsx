"use client";

import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn, formatNumber } from "@/shared/lib";
import { Skeleton } from "@/shared/ui/skeleton";

import { FC } from "react";

import { ListVideo } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PlaylistWithRelations } from "../../model/playlist-with-relations";
import styles from "./playlist-card.module.scss";

interface Props {
  playlist: PlaylistWithRelations;
  isOnChannelPage?: boolean;
}

const PlaylistCard: FC<Props> = ({ playlist, isOnChannelPage }) => {
  const router = useRouter();

  const videosWithThumbnails = playlist?.videos?.filter(
    (video) => video.thumbnailUrl,
  );

  const thumbnailUrl = playlist.thumbnailUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
      playlist.thumbnailUrl?.replace(/\\/g, "/")
    : videosWithThumbnails?.length
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
        videosWithThumbnails[0].thumbnailUrl
      : null;

  return (
    <div className="w-full rounded-lg">
      <Link
        href={PublicRoutes.PLAYLIST(playlist)}
        className={cn(
          "block rounded-lg w-full aspect-video relative user-select-none before:bg-gray-300 dark:before:bg-neutral-500 after:bg-gray-400 dark:after:bg-neutral-700",
          styles.card,
        )}
        title={playlist.title}
        onClick={(event) => !playlist?.videos?.length && event.preventDefault()}
      >
        <div className="block rounded-lg w-full h-full relative z-[1] bg-secondary dark:bg-black border-t border-secondary dark:border-black">
          <Image
            src={thumbnailUrl || "/playlist-thumbnail.webp"}
            alt={playlist.title}
            width={224}
            height={126}
            className={cn(
              "w-full h-full object-contain object-center rounded-lg",
              !thumbnailUrl && "object-cover",
            )}
          />
          <span className="absolute bottom-[2%] right-[2%] overflow-hidden flex items-center gap-1 text-xs bg-black/60 text-white p-1 rounded">
            <ListVideo size={12} />
            <span>{formatNumber(playlist.videos.length || 0)} video</span>
          </span>
        </div>
      </Link>
      <Link
        href={PublicRoutes.PLAYLIST(playlist)}
        className="mt-2 text-base text-primary line-clamp-2 overflow-hidden"
        onClick={(event) => !playlist?.videos?.length && event.preventDefault()}
      >
        {playlist.title}
      </Link>
      {!isOnChannelPage && playlist?.channel?.slug && (
        <Link
          className="line-clamp-1 mt-1 text-sm text-primary/70 transition-colors hover:text-primary/90"
          href={PublicRoutes.CHANNEL(playlist?.channel?.slug)}
        >
          {playlist.channel.title}
        </Link>
      )}
    </div>
  );
};

export const VideoCardSkeleton = () => {
  return <Skeleton className="w-full aspect-video" />;
};

export default PlaylistCard;
