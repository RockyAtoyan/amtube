"use client";

import { cn } from "@/shared/lib";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import { Button } from "@/shared/ui/button";

import { FC, useState } from "react";

import { ChevronDown } from "lucide-react";

import NavItem from "./nav-item";
import { MenuProps } from "./sidebar.types";

const ITEMS_LIMIT = 4;

const Menu: FC<MenuProps> = ({ items, title, isLimited = true }) => {
  const { collapse } = useSidebarStore();

  const [isShowMore, setShowMore] = useState(!isLimited);

  return (
    <nav className="flex flex-col gap-2 mb-6">
      {title && (
        <h3
          className={cn(
            "text-[0.7rem] font-semibold uppercase text-primary/50 mb-2 transition-all duration-300 ease-in-out",
            collapse && "opacity-0 invisible",
          )}
        >
          {title}
        </h3>
      )}
      {items.slice(0, isShowMore ? items.length : ITEMS_LIMIT).map((item) => {
        return <NavItem key={item.href} item={item} />;
      })}
      {isLimited && items.length > ITEMS_LIMIT && (
        <Button
          className="w-full h-auto flex items-center gap-4 p-0 justify-start hover:no-underline"
          variant="link"
          onClick={() => setShowMore(!isShowMore)}
        >
          <Button asChild variant="link" size="icon">
            <ChevronDown
              className={cn(
                "transition-transform duration-300 ease-in-out",
                isShowMore && "rotate-180",
              )}
            />
          </Button>
          <span className="text-[0.7rem] font-semibold uppercase text-primary/50">
            {isShowMore ? "show less" : "show more"}
          </span>
        </Button>
      )}
    </nav>
  );
};

export default Menu;
