"use client";

import { useFindSimilarVideos } from "@/entities/video/api/hooks";
import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import VideoSheet, {
  VideoSkeletonSheet,
} from "@/features/video-sheet/video-sheet";
import { Loader } from "@/shared/ui/loader";

import { FC } from "react";

import { CheckCheck } from "lucide-react";

interface Props {
  video: VideoWithRelations;
}

const SimilarVideos: FC<Props> = ({ video }) => {
  const { similarVideosPages, loading, isFetchingNextPage, flagRef } =
    useFindSimilarVideos(video.id);

  return (
    <div>
      <h2 className="text-xl mb-5 flex items-center gap-3">
        <CheckCheck className="text-accent" size={24} /> Similar video
      </h2>
      <div className="flex flex-col gap-8">
        {loading && <VideoSkeletonSheet cols={1} />}
        {!loading &&
          !!similarVideosPages?.length &&
          similarVideosPages
            .filter((page) => page?.videos?.length)
            .map((page, index) => (
              <VideoSheet key={index} videos={page.videos} cols={1} />
            ))}
        <div ref={flagRef}></div>
      </div>
      {!loading && isFetchingNextPage && <Loader className="mx-auto my-6" />}
    </div>
  );
};

export default SimilarVideos;
