"use client";

import { cn } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth.store";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import Separator from "@/shared/ui/separator";
import Menu from "@/shared/ui/sidebar/menu";
import SidebarSheet from "@/shared/ui/sidebar/sidebar-sheet";

import SidebarSubscriptions from "./public-sidebar-subscriptions";
import { SIDEBAR_DATA } from "./public-sidebar.data";

const PublicSidebar = () => {
  const { collapse } = useSidebarStore();
  const { user } = useAuthStore();

  const subscriptions = user?.subscribes;

  return (
    <SidebarSheet>
      <Menu items={SIDEBAR_DATA.TOP_NAV} />
      <Separator
        className={cn(
          "my-6 w-full transition-all duration-300 ease-in-out",
          collapse && "w-10",
        )}
      />
      <Menu items={SIDEBAR_DATA.CENTER_NAV} />
      {!!subscriptions?.length && (
        <SidebarSubscriptions items={subscriptions} />
      )}
      <Menu items={SIDEBAR_DATA.BOTTOM_NAV} title="more from amtube" />
    </SidebarSheet>
  );
};

export default PublicSidebar;
