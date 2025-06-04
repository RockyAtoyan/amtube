import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn } from "@/shared/lib";
import {
  SearchPlaylistsFilter,
  SearchPlaylistsFilterValues,
} from "@/shared/lib/types/playlists.types";
import SearchedPlaylists from "@/widgets/searched-playlists/searched-playlists";

import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPlaylistsPage({ searchParams }: Props) {
  const params = await searchParams;
  const searchTerm = (params?.searchTerm || "") as string;
  const filter = (params?.filter || "popular") as SearchPlaylistsFilter;

  return (
    <div>
      <div className="flex items-center justify-end gap-5 mb-3">
        {SearchPlaylistsFilterValues.map((value) => {
          return (
            <Link
              key={value}
              className={cn(
                "text-sm text-primary/70 transition-colors hover:text-primary",
                filter === value && "text-primary underline",
              )}
              href={PublicRoutes.SEARCH_PLAYLISTS(searchTerm, value)}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <SearchedPlaylists searchTerm={searchTerm} filter={filter} />
    </div>
  );
}
