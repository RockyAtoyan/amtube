import { Channel } from "@/entities/channel/model/channel";
import { useToggleChannelSubscribe } from "@/entities/user/api/hooks";
import { useAuthStore } from "@/shared/store/auth.store";

import toast from "react-hot-toast";

export const useToggleFollowChannel = (channel: Channel) => {
  const { user, isPending } = useAuthStore();

  const { toggleChannelSubscribe, isPending: isFollowPending } =
    useToggleChannelSubscribe();

  const isSubscribed = !!user?.subscribes?.some((ch) => ch.id === channel.id);

  const toggleFollow = () => {
    if (isPending) return;
    if (!user) {
      toast.error("You have to sign in!");
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

  return { toggleFollow, isFollowPending, isSubscribed };
};
