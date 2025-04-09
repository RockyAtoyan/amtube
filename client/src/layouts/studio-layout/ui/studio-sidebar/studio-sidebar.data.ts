import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { INavItem } from "@/shared/ui/sidebar/sidebar.types";

import { Clapperboard, Grid2X2, ListVideo, Tv, Upload } from "lucide-react";

type ISidebarData = INavItem[];

export const STUDIO_SIDEBAR_DATA: ISidebarData = [
  {
    label: "Dashboard",
    href: StudioRoutes.STUDIO_HOME,
    icon: Grid2X2,
  },
  {
    label: "Upload",
    href: StudioRoutes.VIDEO_UPLOAD,
    icon: Upload,
  },
  {
    label: "Videos",
    href: StudioRoutes.VIDEOS,
    icon: Clapperboard,
  },
  {
    label: "Playlists",
    href: StudioRoutes.PLAYLISTS,
    icon: ListVideo,
  },
  {
    label: "Channel",
    href: StudioRoutes.CHANNEL,
    icon: Tv,
  },
];
