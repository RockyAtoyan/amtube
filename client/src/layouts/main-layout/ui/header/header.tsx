"use client";

import ProfileButton from "@/features/profile-button/profile-button";
import ToggleThemeButton from "@/features/toggle-theme/toggle-theme";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import { Button } from "@/shared/ui/button";

import { Grid2X2, SearchIcon, SquarePlusIcon } from "lucide-react";
import Link from "next/link";

import {
  HEADER_Z_INDEX,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
} from "../constants";
import NotificationsButton from "./notifications-button";
import SearchInput from "./search-input";

const Header = () => {
  const { collapse } = useSidebarStore();
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
          <div className="flex items-center gap-1">
            <Button variant="link" size="icon" asChild>
              <Link href={StudioRoutes.VIDEO_UPLOAD}>
                <SquarePlusIcon />
              </Link>
            </Button>
            <Button variant="link" size="icon" asChild>
              <Link href={StudioRoutes.STUDIO_HOME}>
                <Grid2X2 />
              </Link>
            </Button>
            <ToggleThemeButton />
            <NotificationsButton />
          </div>
          <ProfileButton user={{ name: "Robert Atoyan" } as any} />
        </div>
      </div>
    </header>
  );
};

export default Header;
