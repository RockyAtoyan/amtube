"use client";

import PlaylistsRowSheet, {
  PlaylistsRowSkeletonSheet,
} from "@/features/playlists-row-sheet/playlists-row-sheet"
import PlaylistsSheet, {
  PlaylistsSkeletonSheet,
} from "@/features/playlists-sheet/playlists-sheet"
import { useAuthStore } from "@/shared/store/auth.store"

import { FC } from "react"

import UnauthorizedForm from "../unauthorized-form/unauthorized-form"

interface Props {
  isInStudio?: boolean;
}

const UserPlaylists: FC<Props> = ({ isInStudio = true }) => {
  const { user, isPending } = useAuthStore();

  const loading = !user || isPending;

  const playlists = user?.playlists?.filter((playlist) => !playlist?.channelId);

  if (!user && !isPending) {
    return <UnauthorizedForm />;
  }

  return (
    <div>
      {loading && isInStudio && <PlaylistsRowSkeletonSheet />}
      {!loading && !!playlists?.length && isInStudio && (
        <PlaylistsRowSheet isInStudio={isInStudio} playlists={playlists} />
      )}
      {loading && !isInStudio && <PlaylistsSkeletonSheet />}
      {!loading && !!playlists?.length && !isInStudio && (
        <PlaylistsSheet playlists={playlists} />
      )}
      {!loading && !playlists?.length && (
        <p className="text-lg">There are no playlists!</p>
      )}
    </div>
  );
};

export default UserPlaylists;
