"use client";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface RowNavItem {
  pathname: string;
  label: string;
  isHome?: boolean;
}

interface Props {
  items: RowNavItem[];
}

const RowNav: FC<Props> = ({ items }) => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6 border-b border-primary/20">
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            className={cn(
              "bg-transparent hover:bg-transparent border-b-2 border-transparent text-primary/80 rounded-none hover:border-primary/40",
              (item.isHome
                ? pathname === item.pathname
                : pathname.includes(item.pathname)) &&
                "hover:border-primary border-primary text-primary",
            )}
            asChild
          >
            <Link href={item.pathname}>{item.label}</Link>
          </Button>
        );
      })}
    </div>
  );
};

export default RowNav;
