"use client";

import { useGetTrendingVideos } from "@/entities/video/api/hooks";
import VideoRowSheet, {
  VideoRowSkeletonSheet,
} from "@/features/video-row-sheet/video-row-sheet";
import { Loader } from "@/shared/ui/loader";

import { Flame } from "lucide-react";

const TrendingVideos = () => {
  const { trendingVideosPages, loading, isFetchingNextPage, flagRef } =
    useGetTrendingVideos();

  return (
    <div>
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <Flame className="text-accent" size={24} /> Trending
      </h2>
      <div className="flex flex-col gap-8">
        {loading && <VideoRowSkeletonSheet />}
        {!loading &&
          !!trendingVideosPages?.length &&
          trendingVideosPages
            .filter((page) => page.length)
            .map((page, index) => <VideoRowSheet key={index} videos={page} />)}
        <div ref={flagRef}></div>
      </div>
      {!loading && isFetchingNextPage && <Loader className="mx-auto my-6" />}
    </div>
  );
};

export default TrendingVideos;
