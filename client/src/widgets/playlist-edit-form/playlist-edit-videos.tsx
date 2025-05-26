import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import VideoRowSheet from "@/features/video-row-sheet/video-row-sheet";

import { FC } from "react";

interface Props {
  playlist: PlaylistWithRelations;
}

const PlaylistEditVideos: FC<Props> = ({ playlist }) => {
  return (
    <div className="pt-3 border-t border-border mt-5">
      <p className="text-lg">Playlist's Video</p>
      <p className="text-sm text-primary/70 mb-5">
        Remove video from playlist.
      </p>
      {!!playlist?.videos.length && (
        <VideoRowSheet editPlaylistId={playlist.id} videos={playlist.videos} />
      )}
      {!playlist?.videos.length && (
        <p className="text-lg">There are no video!</p>
      )}
    </div>
  );
};

export default PlaylistEditVideos;
