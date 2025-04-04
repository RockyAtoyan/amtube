import { cn } from "@/shared/lib";
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
    (pathname.startsWith(item.href) && item.href !== "/");

  return (
    <Link
      title={item.label}
      className={cn("flex items-center gap-4")}
      href={item.href}
    >
      <Button
        variant={"link"}
        size="icon"
        className={isActive ? "text-primary/100" : ""}
        asChild
      >
        <item.icon
          className={cn(
            "transition-colors",
            isActive && "text-accent-secondary",
          )}
        />
      </Button>
      <span>{item.label}</span>
    </Link>
  );
};

export default NavItem;
