import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import VideoSheet from "@/features/video-sheet/video-sheet";

import { FC } from "react";

interface Props {
  videos: VideoWithRelations[];
}

const ChannelVideoSheet: FC<Props> = ({ videos }) => {
  return (
    <div>
      <VideoSheet videos={videos} />
    </div>
  );
};

export default ChannelVideoSheet;
