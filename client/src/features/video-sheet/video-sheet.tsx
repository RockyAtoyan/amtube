import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import VideoCard, {
  VideoCardSkeleton,
} from "@/entities/video/ui/video-card/video-card";

import { FC } from "react";

interface Props {
  videos: VideoWithRelations[];
  cols?: number;
}

const VideoSheet: FC<Props> = ({ videos, cols = 4 }) => {
  return (
    <div
      className="grid gap-8"
      style={{ gridTemplateColumns: "1fr ".repeat(cols) }}
    >
      {videos.map((video) => (
        <VideoCard key={video.publicId} video={video} />
      ))}
    </div>
  );
};

export const VideoSkeletonSheet = ({ n = 12, cols = 4 }) => {
  return (
    <div
      className="grid gap-x-8 gap-y-28"
      style={{ gridTemplateColumns: "1fr ".repeat(cols) }}
    >
      {Array(n)
        .fill(0)
        .map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default VideoSheet;
