"use client";

import PlaylistsRowSheet, {
  PlaylistsRowSkeletonSheet,
} from "@/features/playlists-row-sheet/playlists-row-sheet";
import { useAuthStore } from "@/shared/store/auth.store";

const UserPlaylists = () => {
  const { user, isPending } = useAuthStore();

  const loading = !user || isPending;

  const playlists = user?.playlists?.filter((playlist) => !playlist?.channelId);

  return (
    <div>
      {loading && <PlaylistsRowSkeletonSheet />}
      {!loading && !!playlists?.length && (
        <PlaylistsRowSheet isInStudio playlists={playlists} />
      )}
      {!loading && !user?.playlists.length && (
        <p className="text-lg">There are no playlists!</p>
      )}
    </div>
  );
};

export default UserPlaylists;
