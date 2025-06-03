"use client";

import { useAddVideoToHistory } from "@/entities/user/api/hooks";
import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import VideoRowCardActions from "@/entities/video/ui/video-row-card/video-row-card-actions";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import {
  cn,
  formatDateRelative,
  formatNumber,
  getChannelLogoLetters,
} from "@/shared/lib";
import { useToggleFollowChannel } from "@/shared/lib/hooks/useToggleFollowChannel";
import { useToggleLikeVideo } from "@/shared/lib/hooks/useToggleLikeVideo";
import { useAuthStore } from "@/shared/store/auth.store";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { FC, useEffect } from "react";

import { Bell, ThumbsUp } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const VideoInfoDescription = dynamic(() => import("./video-info-description"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[6.25rem] mt-4" />,
});

interface VideoInfoProps {
  video: VideoWithRelations;
}

const VideoInfo: FC<VideoInfoProps> = ({ video }) => {
  const { user } = useAuthStore();

  const { title, views, likes, createdAt, tags } = video;

  const { toggleFollow, isSubscribed, isFollowPending } =
    useToggleFollowChannel(video.channel);

  const { toggleLike, isLiked, isLikePending } = useToggleLikeVideo(video);

  const { addVideoToHistory } = useAddVideoToHistory();

  const loading = isFollowPending || isLikePending;

  const formattedDate = formatDateRelative(createdAt);

  useEffect(() => {
    if (user) {
      addVideoToHistory({ userId: user.id, videoId: video.id });
    }
  }, [user]);

  return (
    <div className="w-full mt-4">
      <h1 className="text-xl md:text-2xl font-semibold line-clamp-2">
        {title}
      </h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-3 gap-3">
        <div className="flex items-center gap-8">
          <Link
            className="group flex items-center gap-4"
            href={PublicRoutes.CHANNEL(video.channel.slug)}
          >
            <Button
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-[15%] overflow-hidden flex items-center justify-center",
                !video.channel.avatarUrl && "bg-primary",
              )}
              variant={"link"}
              size="icon"
            >
              {!video.channel.avatarUrl && (
                <span className="font-semibold text-lg text-background">
                  {getChannelLogoLetters(video.channel.title)}
                </span>
              )}
              {video.channel.avatarUrl && (
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
                    video.channel.avatarUrl
                  }
                  alt={video.channel.title}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover object-center "
                />
              )}
            </Button>
            <span className="group-hover:text-accent-secondary line-clamp-1 max-w-[9.375rem]">
              {video.channel.title}
            </span>
          </Link>
          <Button
            disabled={loading}
            className={`flex items-center gap-2 rounded-full text-sm font-medium transition`}
            onClick={toggleFollow}
            variant={isSubscribed ? "secondary" : "destructive"}
            aria-label={isSubscribed ? "Unsubscribe" : "Subscribe"}
          >
            <Bell size={16} />
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={loading}
            variant="outline"
            className={cn(
              `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition`,
              isLiked && "text-accent",
            )}
            onClick={toggleLike}
            aria-label="Like"
          >
            <ThumbsUp size={16} />
            {formatNumber(likes.length)}
          </Button>
          <VideoRowCardActions video={video} />
        </div>
      </div>

      <div className="mt-3 text-sm">
        {formatNumber(views.length)} views • {formattedDate}
      </div>

      {video.description.trim() && (
        <VideoInfoDescription description={video.description} />
      )}

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {tags.map((tag) => (
            <Badge key={tag.id}>{tag.name}</Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoInfo;
