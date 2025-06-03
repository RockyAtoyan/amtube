"use client";

import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import { formatNumber } from "@/shared/lib";

import { FC, useEffect } from "react";

import VideoPlaylistListItem from "./video-playlist-list-item";

interface Props {
  video: VideoWithRelations;
  playlist: PlaylistWithRelations;
}

const VideoPlaylistList: FC<Props> = ({ video, playlist }) => {
  useEffect(() => {
    if (video) {
      document
        .getElementById(video.publicId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [video]);

  return (
    <div>
      <div className="p-4 rounded-t-lg bg-border">
        <p className="line-clamp-1 mb-1 text-lg">{playlist.title}</p>
        <span className="text-xs text-primary/60">
          {formatNumber(playlist?.videos?.length || 0)} video
        </span>
      </div>
      <div className="h-[25rem] pt-2 overflow-auto mb-8 rounded-b-lg border border-border">
        <div className="flex flex-col gap-1">
          {playlist?.videos?.map((v) => {
            return (
              <VideoPlaylistListItem
                key={v.id}
                video={v}
                playlist={playlist}
                isActive={v.id === video.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPlaylistList;
