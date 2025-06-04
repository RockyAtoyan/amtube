"use client";

import { cn } from "@/shared/lib";
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "@/shared/lib/constants";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import { Button } from "@/shared/ui/button";
import Logo from "@/shared/ui/logo";

import { Menu as MenuIcon } from "lucide-react";

const SidebarSheet = ({
  children,
  isInStudio,
}: {
  children: React.ReactNode;
  isInStudio?: boolean;
}) => {
  const { collapse, toggleCollapse } = useSidebarStore();

  return (
    <aside
      className={cn(
        "flex-shrink-0 border-r border-border transition-all duration-300 ease-in-out relative h-full overflow-auto",
      )}
      style={{
        width: collapse ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
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
            <Logo isInStudio={isInStudio} />
          </div>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarSheet;
