import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import VideoRowCard, {
  VideoRowCardSkeleton,
} from "@/entities/video/ui/video-row-card/video-row-card";

import { FC } from "react";

interface Props {
  videos: VideoWithRelations[];
  editPlaylistId?: string;
  fromPlaylistId?: string;
  isInStudio?: boolean;
}

const VideoRowSheet: FC<Props> = ({
  videos,
  editPlaylistId,
  fromPlaylistId,
  isInStudio,
}) => {
  return (
    <div className="flex flex-col gap-8">
      {videos.map((video) => (
        <VideoRowCard
          key={video.publicId}
          editPlaylistId={editPlaylistId}
          fromPlaylistId={fromPlaylistId}
          video={video}
          isInStudio={isInStudio}
        />
      ))}
    </div>
  );
};

export const VideoRowSkeletonSheet = ({ n = 12 }) => {
  return (
    <div className="flex flex-col gap-8">
      {Array(n)
        .fill(0)
        .map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default VideoRowSheet;
