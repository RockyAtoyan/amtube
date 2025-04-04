import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";

import {
  BookCopy,
  CirclePlay,
  Clock,
  Compass,
  Flame,
  Heart,
  History,
  Library,
  MessageCircleWarning,
  Settings,
} from "lucide-react";

import { INavItem } from "./sidebar.types";

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
      label: "Likes videos",
      href: PublicRoutes.LIKES,
      icon: Heart,
    },
    {
      label: "Playlists",
      href: PublicRoutes.PLAYLISTS,
      icon: BookCopy,
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
