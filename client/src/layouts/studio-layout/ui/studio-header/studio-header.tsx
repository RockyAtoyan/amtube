"use client";

import ProfileButton from "@/features/profile-button/profile-button";
import SearchInput from "@/features/search-input/search-input";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import {
  HEADER_Z_INDEX,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
} from "@/shared/lib/constants";
import { useAuthStore } from "@/shared/store/auth.store";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

import { SearchIcon } from "lucide-react";
import Link from "next/link";

import StudioHeaderActions from "./studio-header-actions";

const StudioHeader = () => {
  const { collapse } = useSidebarStore();
  const { user, isPending } = useAuthStore();

  return (
    <header
      className="fixed top-0 right-0 py-3 px-6 pl-12 border-b border-border bg-background h-[4rem] transition-[width] duration-300 ease-in-out"
      style={{
        zIndex: HEADER_Z_INDEX,
        width: `calc(100% - ${collapse ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH})`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <SearchIcon className="text-primary/60" size={20} />
          <SearchInput />
        </div>
        <div className="flex items-center gap-5">
          <StudioHeaderActions />
          {user ? (
            <ProfileButton user={user} />
          ) : !isPending ? (
            <Button asChild>
              <Link href={PublicRoutes.SIGN_IN}>Sign in</Link>
            </Button>
          ) : (
            <Skeleton className="w-10 h-10 rounded-lg" />
          )}
        </div>
      </div>
    </header>
  );
};

export default StudioHeader;
