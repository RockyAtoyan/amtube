"use client";

import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import VideoCard from "@/entities/video/ui/video-card/video-card";
import { VideoSkeletonSheet } from "@/features/video-sheet/video-sheet";
import { Button } from "@/shared/ui/button";

import { FC, useState } from "react";

import { ChevronRight } from "lucide-react";
import { FreeMode, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";

interface Props {
  videos?: VideoWithRelations[];
  slidesPerView?: number;
  isLoading?: boolean;
}

const VideoSlider: FC<Props> = ({ videos, slidesPerView = 3, isLoading }) => {
  const [slider, setSlider] = useState<SwiperType | null>(null);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative">
      {!isLoading && !!videos?.length && videos.length > slidesPerView && (
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
      {(isLoading || !videos?.length) && <VideoSkeletonSheet n={3} cols={3} />}
      {!isLoading && !!videos?.length && (
        <Swiper
          modules={[Scrollbar, FreeMode]}
          freeMode={true}
          spaceBetween={50}
          slidesPerView={slidesPerView}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => setSlider(swiper)}
          onSlideChange={(swiper) => setIsEnd(swiper.isEnd)}
        >
          {videos.map((video) => {
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

export default VideoSlider;
