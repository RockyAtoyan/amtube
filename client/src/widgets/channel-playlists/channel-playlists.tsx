"use client";

import { useGetChannelBySlug } from "@/entities/channel/api/hooks"
import PlaylistsRowSheet, {
  PlaylistsRowSkeletonSheet,
} from "@/features/playlists-row-sheet/playlists-row-sheet"
import { useAuthStore } from "@/shared/store/auth.store"

const ChannelPlaylists = () => {
  const { user, isPending } = useAuthStore();

  const { channel, isLoading } = useGetChannelBySlug(user?.channel?.slug || "");

  const loading = !user || isLoading || isPending;

  return (
    <div>
      {loading && <PlaylistsRowSkeletonSheet />}
      {!loading && !!channel?.playlists?.length && (
        <PlaylistsRowSheet isInStudio playlists={channel.playlists} />
      )}
      {!loading && !channel?.playlists?.length && (
        <p className="text-lg">There are no playlists!</p>
      )}
    </div>
  );
};

export default ChannelPlaylists;
