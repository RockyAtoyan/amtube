"use client";

import RowNav from "@/features/row-nav/row-nav";
import { PublicRoutes } from "@/shared/config/routes/public.routes";

import { useSearchParams } from "next/navigation";

const SearchNav = () => {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("searchTerm") || "";

  return (
    <>
      <RowNav
        items={[
          {
            label: "Video",
            pathname: PublicRoutes.SEARCH_VIDEO(searchTerm),
            isHome: true,
          },
          {
            label: "Playlists",
            pathname: PublicRoutes.SEARCH_PLAYLISTS(searchTerm),
          },
        ]}
      />
    </>
  );
};

export default SearchNav;
