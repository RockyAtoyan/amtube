"use client";

import { useGetPlaylists } from "@/entities/playlist/api/hooks";
import PlaylistsRowSheet, {
  PlaylistsRowSkeletonSheet,
} from "@/features/playlists-row-sheet/playlists-row-sheet";
import { SearchPlaylistsFilter } from "@/shared/lib/types/playlists.types";
import { Loader } from "@/shared/ui/loader";

import { FC, useEffect } from "react";

interface Props {
  searchTerm: string;
  filter?: SearchPlaylistsFilter;
}

const SearchedPlaylists: FC<Props> = ({ searchTerm, filter }) => {
  const { playlistsPages, loading, isFetchingNextPage, flagRef, refetch } =
    useGetPlaylists(searchTerm, filter);

  useEffect(() => {
    refetch();
  }, [searchTerm, filter]);

  return (
    <div>
      <div className="flex flex-col gap-8">
        {loading && <PlaylistsRowSkeletonSheet />}
        {!loading &&
          !!playlistsPages?.length &&
          playlistsPages
            .filter((page) => page?.playlists?.length)
            .map((page, index) => (
              <PlaylistsRowSheet key={index} playlists={page.playlists} />
            ))}
        <div ref={flagRef}></div>
      </div>
      {!playlistsPages[0]?.totalCount && (
        <p className="text-lg">There are no playlists!</p>
      )}
      {!loading && isFetchingNextPage && <Loader className="mx-auto my-6" />}
    </div>
  );
};

export default SearchedPlaylists;
