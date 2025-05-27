"use client";

import { useGetChannelBySlug } from "@/entities/channel/api/hooks";
import VideoRowSheet, {
  VideoRowSkeletonSheet,
} from "@/features/video-row-sheet/video-row-sheet";
import { useAuthStore } from "@/shared/store/auth.store";

const StudioVideos = () => {
  const { user, isPending } = useAuthStore();

  const { channel, isLoading } = useGetChannelBySlug(user?.channel?.slug || "");

  const loading = !user || !channel || isLoading || isPending;

  return (
    <div>
      {loading && <VideoRowSkeletonSheet />}
      {!loading && !!channel?.playlists?.length && (
        <VideoRowSheet isInStudio videos={channel.videos} />
      )}
      {!loading && !channel?.playlists.length && (
        <p className="text-lg">There are no video!</p>
      )}
    </div>
  );
};

export default StudioVideos;
