import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { INavItem } from "@/shared/ui/sidebar/sidebar.types";

import {
  CirclePlay,
  Clock,
  Compass,
  Flame,
  Heart,
  History,
  Library,
  ListVideo,
  MessageCircleWarning,
  Settings,
} from "lucide-react";

interface ISidebarData {
  TOP_NAV: INavItem[];
  CENTER_NAV: INavItem[];
  BOTTOM_NAV: INavItem[];
}

export const SIDEBAR_DATA: ISidebarData = {
  TOP_NAV: [
    {
      label: "Explore",
      href: PublicRoutes.HOME,
      icon: Compass,
    },
    {
      label: "Trending",
      href: PublicRoutes.TRENDING,
      icon: Flame,
    },
    {
      label: "Subscriptions",
      href: PublicRoutes.SUBSCRIPTIONS,
      icon: CirclePlay,
    },
  ],
  CENTER_NAV: [
    {
      label: "Library",
      href: PublicRoutes.LIBRARY,
      icon: Library,
    },
    {
      label: "History",
      href: PublicRoutes.HISTORY,
      icon: History,
    },
    {
      label: "Watch later",
      href: PublicRoutes.WATCH_LATER,
      icon: Clock,
    },
    {
      label: "Liked videos",
      href: PublicRoutes.LIKES,
      icon: Heart,
    },
    {
      label: "Playlists",
      href: PublicRoutes.PLAYLISTS,
      icon: ListVideo,
    },
  ],
  BOTTOM_NAV: [
    {
      label: "Settings",
      href: StudioRoutes.STUDIO_HOME,
      icon: Settings,
    },
    {
      label: "Send feedback",
      href: PublicRoutes.SEND_FEEDBACK,
      icon: MessageCircleWarning,
    },
  ],
};
