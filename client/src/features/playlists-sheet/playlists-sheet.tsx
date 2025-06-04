import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import PlaylistCard from "@/entities/playlist/ui/playlist-card/playlist-card";
import { PlaylistRowCardSkeleton } from "@/entities/playlist/ui/playlist-row-card/playlist-row-card";

import { FC } from "react";

interface Props {
  playlists: PlaylistWithRelations[];
  isOnChannelPage?: boolean;
}

const PlaylistsSheet: FC<Props> = ({ playlists, isOnChannelPage }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          isOnChannelPage={isOnChannelPage}
        />
      ))}
    </div>
  );
};

export const PlaylistsSkeletonSheet = ({ n = 12, cols = 5 }) => {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "1fr ".repeat(cols) }}
    >
      {Array(n)
        .fill(0)
        .map((_, index) => (
          <PlaylistRowCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default PlaylistsSheet;
