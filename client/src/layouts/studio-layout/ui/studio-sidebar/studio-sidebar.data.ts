import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { INavItem } from "@/shared/ui/sidebar/sidebar.types";

import {
  Clapperboard,
  Grid2X2,
  ListVideo,
  MessageCircleWarning,
  Settings,
  Tv,
  Upload,
} from "lucide-react";

interface ISidebarData {
  TOP: INavItem[];
  BOTTOM: INavItem[];
}

export const STUDIO_SIDEBAR_DATA: ISidebarData = {
  TOP: [
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
  ],
  BOTTOM: [
    {
      label: "Profile settings",
      href: StudioRoutes.PROFILE,
      icon: Settings,
    },
    {
      label: "Send feedback",
      href: PublicRoutes.SEND_FEEDBACK,
      icon: MessageCircleWarning,
    },
  ],
};
