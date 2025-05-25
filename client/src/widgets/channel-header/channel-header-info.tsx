"use client";

import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations";
import { useToggleChannelSubscribe } from "@/entities/user/api/hooks";
import { cn, formatNumber, getChannelLogoLetters } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { FC } from "react";
import toast from "react-hot-toast";

import dynamic from "next/dynamic";
import Image from "next/image";

const ChannelHeaderDescription = dynamic(
  () => import("./channel-header-description"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[1.3125rem] w-[12.5rem]" />,
  },
);

interface Props {
  channel: ChannelWithRelations;
}

const ChannelHeaderInfo: FC<Props> = ({ channel }) => {
  const { user, isPending } = useAuthStore();

  const { toggleChannelSubscribe, isPending: isFollowPending } =
    useToggleChannelSubscribe();

  const isSubscribed = !!user?.subscribes?.some((ch) => ch.id === channel.id);

  const toggleFollow = () => {
    if (isPending) return;
    if (!user) {
      toast.error("You gave to sign in!");
      return;
    }
    if (user?.channel?.id === channel.id) {
      toast.error("You can not subscribe to your own channel!");
      return;
    }
    toggleChannelSubscribe(
      {
        channelId: channel.id,
        isSubscribed,
        userId: user.id,
      },
      {
        onSuccess(data, variables, context) {
          toast.success(
            !isSubscribed
              ? `You subscribed on "${channel.title}"!`
              : `You unsubscribed from "${channel.title}"!`,
          );
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-5">
      <div
        className={cn(
          "block h-30 aspect-square rounded-[15%] overflow-hidden flex items-center justify-center",
          !channel.avatarUrl && "bg-primary",
        )}
      >
        {channel.avatarUrl && (
          <Image
            src={
              `${process.env.NEXT_PUBLIC_API_URL}/uploads` + channel.avatarUrl
            }
            alt="Avatar"
            width={100}
            height={100}
            className="w-full h-full object-cover object-center"
          />
        )}
        {!channel.avatarUrl && (
          <span className="font-semibold text-6xl text-background">
            {getChannelLogoLetters(channel.title)}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-semibold max-w-2xl line-clamp-3 mb-1">
          {channel.title}
        </p>
        <p className="text-sm flex items-center gap-3 mb-2 text-primary/70">
          <span>{formatNumber(channel.subscribers.length)} subscribers</span>
          <span>•</span>
          <span>{formatNumber(channel.videos.length)} video</span>
        </p>
        <ChannelHeaderDescription channel={channel} />
        <Button
          className="mt-3"
          disabled={isPending || isFollowPending}
          onClick={toggleFollow}
        >
          {user ? (isSubscribed ? "Unsubscribe" : "Subscribe") : "Subscribe"}
        </Button>
      </div>
    </div>
  );
};

export default ChannelHeaderInfo;
