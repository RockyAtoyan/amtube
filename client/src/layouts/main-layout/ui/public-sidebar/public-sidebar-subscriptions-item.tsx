import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { getChannelLogoLetters } from "@/shared/lib";
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
      className="flex items-center gap-4"
      href={PublicRoutes.CHANNEL(item.slug)}
    >
      <Button variant={"link"} size="icon" asChild>
        {!item.avatarUrl && getChannelLogoLetters(item.title)}
        {item.avatarUrl && (
          <Image
            src={item.avatarUrl}
            alt={item.title}
            width={32}
            height={32}
            className="w-10 h-10 object-cover object-center"
          />
        )}
      </Button>
      <span>{item.title}</span>
    </Link>
  );
};

export default SidebarSubscriptionItem;
