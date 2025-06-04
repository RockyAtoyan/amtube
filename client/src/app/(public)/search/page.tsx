import { PublicRoutes } from "@/shared/config/routes/public.routes"
import { cn } from "@/shared/lib"
import {
	SearchVideoFilter,
	SearchVideoFilterValues,
} from "@/shared/lib/types/videos.types"
import SearchedVideos from "@/widgets/searched-videos/searched-videos"

import Link from "next/link"

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const searchTerm = (params?.searchTerm || "") as string;
  const filter = (params?.filter || "popular") as SearchVideoFilter;

  return (
    <div>
      <div className="flex items-center justify-end gap-5 mb-3">
        {SearchVideoFilterValues.map((value) => {
          return (
            <Link
						key={value}
              className={cn(
                "text-sm text-primary/70 transition-colors hover:text-primary",
                filter === value && "text-primary underline",
              )}
              href={PublicRoutes.SEARCH_VIDEO(searchTerm, value)}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <SearchedVideos searchTerm={searchTerm} filter={filter} />
    </div>
  );
}
