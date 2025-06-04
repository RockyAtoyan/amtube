"use client";

import PlaylistsSheet, {
  PlaylistsSkeletonSheet,
} from "@/features/playlists-sheet/playlists-sheet";
import { useAuthStore } from "@/shared/store/auth.store";
import { Loader } from "@/shared/ui/loader";

const UserSavedPlaylists = () => {
  const { user, isPending } = useAuthStore();

  const loading = !user || isPending;

  const playlists = user?.savedPlaylists;

  if (!user && !isPending) {
    return <Loader />;
  }

  return (
    <div>
      {loading && <PlaylistsSkeletonSheet />}
      {!loading && !!playlists?.length && (
        <PlaylistsSheet playlists={playlists} />
      )}
      {!loading && !playlists?.length && (
        <p className="text-lg">There are no playlists!</p>
      )}
    </div>
  );
};

export default UserSavedPlaylists;
