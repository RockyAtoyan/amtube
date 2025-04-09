"use client";

import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn } from "@/shared/lib";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import Separator from "@/shared/ui/separator";
import Menu from "@/shared/ui/sidebar/menu";
import SidebarSheet from "@/shared/ui/sidebar/sidebar-sheet";

import { MessageCircleWarning } from "lucide-react";

import { STUDIO_SIDEBAR_DATA } from "./studio-sidebar.data";

const StudioSidebar = () => {
  const { collapse } = useSidebarStore();

  return (
    <SidebarSheet isInStudio>
      <Menu items={STUDIO_SIDEBAR_DATA} isLimited={false} />
      <Separator
        className={cn(
          "my-6 w-full transition-all duration-300 ease-in-out",
          collapse && "w-10",
        )}
      />
      <Menu
        items={[
          {
            label: "Send feedback",
            href: PublicRoutes.SEND_FEEDBACK,
            icon: MessageCircleWarning,
          },
        ]}
      />
    </SidebarSheet>
  );
};

export default StudioSidebar;
