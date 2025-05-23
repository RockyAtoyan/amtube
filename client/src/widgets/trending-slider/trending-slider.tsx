"use client";

import { useGetTrendingVideosByPage } from "@/entities/video/api/hooks";
import VideoCard from "@/entities/video/ui/video-card/video-card";
import { VideoSkeletonSheet } from "@/features/video-sheet/video-sheet";
import { Button } from "@/shared/ui/button";

import { useState } from "react";

import { ChevronRight, Flame } from "lucide-react";
import { FreeMode, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";

const TrendingSlider = () => {
  const { trendingVideos, isLoading } = useGetTrendingVideosByPage(0);

  const [slider, setSlider] = useState<SwiperType | null>(null);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative mb-8">
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <Flame className="text-accent" size={24} /> Trending
      </h2>
      {!isLoading && !!trendingVideos?.length && (
        <Button
          disabled={isEnd}
          className="absolute top-1/2 -translate-y-1/2 -right-10"
          size={"icon"}
          variant={"link"}
          onClick={() => {
            slider?.slideNext();
          }}
        >
          <ChevronRight />
        </Button>
      )}
      {(isLoading || !trendingVideos?.length) && (
        <VideoSkeletonSheet n={3} cols={3} />
      )}
      {!isLoading && !!trendingVideos?.length && (
        <Swiper
          modules={[Scrollbar, FreeMode]}
          freeMode={true}
          spaceBetween={50}
          slidesPerView={3}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => setSlider(swiper)}
          onSlideChange={(swiper) => setIsEnd(swiper.isEnd)}
        >
          {trendingVideos.map((video) => {
            return (
              <SwiperSlide className="mb-8" key={video.id}>
                <VideoCard video={video} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default TrendingSlider;
