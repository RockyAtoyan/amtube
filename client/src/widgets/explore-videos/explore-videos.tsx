"use client";

import { useGetExploreVideos } from "@/entities/video/api/hooks";
import VideoSheet, {
  VideoSkeletonSheet,
} from "@/features/video-sheet/video-sheet";
import { Loader } from "@/shared/ui/loader";

import { Compass } from "lucide-react";

const ExploreVideos = () => {
  const { exploreVideosPages, loading, isFetchingNextPage, flagRef } =
    useGetExploreVideos();

  return (
    <div>
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <Compass className="text-accent" size={24} /> Explore
      </h2>
      <div className="flex flex-col gap-8">
        {loading && <VideoSkeletonSheet />}
        {!loading &&
          !!exploreVideosPages?.length &&
          exploreVideosPages
            .filter((page) => page.length)
            .map((page, index) => <VideoSheet key={index} videos={page} />)}
        <div ref={flagRef}></div>
      </div>
      {!loading && isFetchingNextPage && <Loader className="mx-auto my-6" />}
    </div>
  );
};

export default ExploreVideos;
