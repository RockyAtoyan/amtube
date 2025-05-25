import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import PlaylistCard from "@/entities/playlist/ui/playlist-card/playlist-card";

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

export default PlaylistsSheet;
