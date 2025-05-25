"use client";

import { useGetTrendingVideosByPage } from "@/entities/video/api/hooks";
import VideoSlider from "@/features/video-slider/video-slider";

import { Flame } from "lucide-react";

const TrendingSlider = () => {
  const { trendingVideos, isLoading } = useGetTrendingVideosByPage(0);

  return (
    <div className="mb-8">
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <Flame className="text-accent" size={24} /> Trending
      </h2>
      <VideoSlider
        videos={trendingVideos}
        slidesPerView={3}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TrendingSlider;
