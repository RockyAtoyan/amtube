"use client";

import { useGetVideos } from "@/entities/video/api/hooks"
import VideoRowSheet, {
  VideoRowSkeletonSheet,
} from "@/features/video-row-sheet/video-row-sheet"
import { SearchVideoFilter } from "@/shared/lib/types/videos.types"
import { Loader } from "@/shared/ui/loader"

import { FC, useEffect } from "react"

interface Props {
  searchTerm: string;
  filter?: SearchVideoFilter;
}

const SearchedVideos: FC<Props> = ({ searchTerm, filter }) => {
  const { videosPages, loading, isFetchingNextPage, flagRef, refetch } =
    useGetVideos(searchTerm, filter);

  useEffect(() => {
    refetch();
  }, [searchTerm, filter]);

  return (
    <div>
      <div className="flex flex-col gap-8">
        {loading && <VideoRowSkeletonSheet />}
        {!loading &&
          !!videosPages?.length &&
          videosPages
            .filter((page) => page?.videos?.length)
            .map((page, index) => (
              <VideoRowSheet key={index} videos={page.videos} />
            ))}
        <div ref={flagRef}></div>
      </div>
      {!videosPages[0]?.totalCount && (
        <p className="text-lg">There are no video!</p>
      )}
      {!loading && isFetchingNextPage && <Loader className="mx-auto my-6" />}
    </div>
  );
};

export default SearchedVideos;
