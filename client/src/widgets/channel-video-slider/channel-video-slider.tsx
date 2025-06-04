import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import VideoSlider from "@/features/video-slider/video-slider";

import { FC } from "react";

interface Props {
  videos: VideoWithRelations[];
}

const ChannelVideoSlider: FC<Props> = ({ videos }) => {
  return (
    <div>
      <p className="text-base text-semibold mb-5">For you</p>
      <VideoSlider videos={videos.slice(0, 10)} slidesPerView={4} />
    </div>
  );
};

export default ChannelVideoSlider;
