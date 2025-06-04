import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn, getChannelLogoLetters } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import { ISidebarSubscriptionItem } from "./public-sidebar.types";

interface Props {
  item: ISidebarSubscriptionItem;
}

const SidebarSubscriptionItem: FC<Props> = ({ item }) => {
  return (
    <Link
      className="group flex items-center gap-4"
      href={PublicRoutes.CHANNEL(item.slug)}
    >
      <Button
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-[15%] overflow-hidden flex items-center justify-center",
          !item.avatarUrl && "bg-primary",
        )}
        variant={"link"}
        size="icon"
      >
        {!item.avatarUrl && (
          <span className="font-semibold text-lg text-background">
            {getChannelLogoLetters(item.title)}
          </span>
        )}
        {item.avatarUrl && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads` + item.avatarUrl}
            alt={item.title}
            width={32}
            height={32}
            className="w-full h-full object-cover object-center "
          />
        )}
      </Button>
      <span className="group-hover:text-accent-secondary line-clamp-1">
        {item.title}
      </span>
    </Link>
  );
};

export default SidebarSubscriptionItem;
