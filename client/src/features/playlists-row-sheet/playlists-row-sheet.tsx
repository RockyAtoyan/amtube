import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import PlaylistRowCard, {
  PlaylistRowCardSkeleton,
} from "@/entities/playlist/ui/playlist-row-card/playlist-row-card";

import { FC } from "react";

interface Props {
  playlists: PlaylistWithRelations[];
  isInStudio?: boolean;
}

const PlaylistsRowSheet: FC<Props> = ({ playlists, isInStudio }) => {
  return (
    <div className="flex flex-col gap-8">
      {playlists.map((playlist) => (
        <PlaylistRowCard
          isInStudio={isInStudio}
          key={playlist.id}
          playlist={playlist}
        />
      ))}
    </div>
  );
};

export const PlaylistsRowSkeletonSheet = ({ n = 12 }) => {
  return (
    <div className="flex flex-col gap-8">
      {Array(n)
        .fill(0)
        .map((_, index) => (
          <PlaylistRowCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default PlaylistsRowSheet;
