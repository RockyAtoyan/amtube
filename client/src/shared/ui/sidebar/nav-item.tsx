import { cn } from "@/shared/lib";
import { useSidebarStore } from "@/shared/store/sidebar.store";
import { Button } from "@/shared/ui/button";

import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { INavItem } from "./sidebar.types";

interface Props {
  item: INavItem;
}

const NavItem: FC<Props> = ({ item }) => {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (pathname.startsWith(item.href) &&
      item.href !== "/" &&
      item.href !== "/studio");

  const { collapse } = useSidebarStore();

  return (
    <Link
      title={item.label}
      className={cn(
        "group flex items-center gap-4 rounded-md transition-colors duration-300 ease-in-out",
        isActive && !collapse && "bg-secondary/80",
      )}
      href={item.href}
    >
      <Button
        variant={"link"}
        size="icon"
        className={isActive ? "text-primary/100" : ""}
        asChild
      >
        <span>
          <item.icon
            className={cn(
              "transition-colors group-hover:text-accent-secondary",
              isActive && "text-accent dark:text-accent-secondary",
            )}
          />
        </span>
      </Button>
      <span
        className={cn(
          "transition-colors",
          !isActive && "group-hover:text-accent-secondary",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
};

export default NavItem;
