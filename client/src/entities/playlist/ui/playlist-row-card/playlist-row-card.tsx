import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn, formatNumber } from "@/shared/lib";
import { Skeleton } from "@/shared/ui/skeleton";

import { FC } from "react";

import { ListVideo } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PlaylistWithRelations } from "../../model/playlist-with-relations";
import styles from "../playlist.module.scss";
import PlaylistRowCardActions from "./playlist-row-card-actions";

interface Props {
  playlist: PlaylistWithRelations;
  isInStudio?: boolean;
}

const PlaylistRowCard: FC<Props> = ({ playlist, isInStudio }) => {
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
    <div className="w-full rounded-lg flex gap-3 relative pt-2">
      <Link
        href={PublicRoutes.PLAYLIST(playlist)}
        className={cn(
          "block rounded-lg w-full max-w-[20rem] aspect-video relative user-select-none before:bg-gray-300 dark:before:bg-neutral-500 after:bg-gray-400 dark:after:bg-neutral-700",
          styles.card,
        )}
        title={playlist.title}
        onClick={(event) => !playlist?.videos?.length && event.preventDefault()}
      >
        <div className="block rounded-lg w-full h-full relative z-[1] bg-secondary dark:bg-black border-t border-secondary dark:border-black">
          <Image
            src={thumbnailUrl || "/thumbnail.webp"}
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
      <div>
        <Link
          href={PublicRoutes.PLAYLIST(playlist)}
          className="mt-2 text-lg text-primary line-clamp-2 overflow-hidden"
          onClick={(event) =>
            !playlist?.videos?.length && event.preventDefault()
          }
        >
          {playlist.title}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-4 text-sm text-primary/60">
          {playlist?.channel && (
            <Link
              className="line-clamp-1 max-w-56 text-sm text-primary/70 transition-colors hover:text-primary/90"
              href={PublicRoutes.CHANNEL(playlist?.channel?.slug)}
            >
              {playlist.channel.title}
            </Link>
          )}
        </div>
      </div>
      <div className="absolute top-0 right-0">
        <PlaylistRowCardActions playlist={playlist} isInStudio={isInStudio} />
      </div>
    </div>
  );
};

export const PlaylistRowCardSkeleton = () => {
  return <Skeleton className="w-full max-w-[20rem] aspect-video" />;
};

export default PlaylistRowCard;
