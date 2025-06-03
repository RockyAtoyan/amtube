import { useGetUserLikedVideos } from "@/entities/user/api/hooks";
import { useToggleLike } from "@/entities/video/api/hooks";
import { Video } from "@/entities/video/model/video";
import { useAuthStore } from "@/shared/store/auth.store";

import toast from "react-hot-toast";

export const useToggleLikeVideo = (video: Video) => {
  const { user, isPending } = useAuthStore();

  const { toggleLikeVideo, isPending: isLikePending } = useToggleLike();
  const { likedVideos } = useGetUserLikedVideos();

  const isLiked = !!likedVideos?.some((v) => v.id === video.id);

  const toggleLike = () => {
    if (isPending) return;
    if (!user) {
      toast.error("You have to sign in!");
      return;
    }
    toggleLikeVideo(
      {
        id: video.id,
        dto: {
          videoId: video.id,
          isLiked: !isLiked,
          userId: user.id,
        },
      },
      {
        onSuccess(data, variables, context) {
          toast.success(
            !isLiked
              ? `You liked "${video.title}"!`
              : `You dislike "${video.title}"!`,
          );
        },
      },
    );
  };

  return { toggleLike, isLikePending, isLiked };
};
