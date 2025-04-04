"use client";

import { cn } from "@/shared/lib";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import { Button } from "@/shared/ui/button";
import Logo from "@/shared/ui/logo";
import Separator from "@/shared/ui/separator";

import { Menu as MenuIcon } from "lucide-react";

import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "../constants";
import Menu from "./menu";
import SidebarSubscriptions from "./sidebar-subscriptions";
import { SIDEBAR_DATA } from "./sidebar.data";

const Sidebar = () => {
  const { collapse, toggleCollapse } = useSidebarStore();

  const subscriptions = [] as any;

  return (
    <aside
      className={cn(
        "flex-shrink-0 border-r border-border transition-all duration-300 ease-in-out relative h-full overflow-auto",
      )}
      style={{
        width: collapse
          ? SIDEBAR_COLLAPSED_WIDTH
          : SIDEBAR_WIDTH,
      }}
    >
      <div className="p-4 overflow-hidden">
        <div className="min-w-56">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleCollapse()}
            >
              <MenuIcon />
            </Button>
            <Logo />
          </div>
          <div className="mt-10">
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
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
