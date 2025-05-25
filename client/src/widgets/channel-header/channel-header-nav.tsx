"use client";

import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  channel: ChannelWithRelations;
}

const ChannelHeaderNav: FC<Props> = ({ channel }) => {
  const pathname = usePathname();
  const channelPathname = PublicRoutes.CHANNEL(channel.slug);

  return (
    <div className="flex items-center gap-6 mt-3 mb-5 border-b border-primary/20">
      <Button
        className={cn(
          "bg-transparent hover:bg-transparent border-b-2 border-transparent text-primary/80 rounded-none hover:border-primary/40",
          pathname === channelPathname &&
            "hover:border-primary border-primary text-primary",
        )}
        asChild
      >
        <Link href={channelPathname}>Home</Link>
      </Button>

      <Button
        className={cn(
          "bg-transparent hover:bg-transparent border-b-2 border-transparent text-primary/80 rounded-none hover:border-primary/40",
          pathname.includes(channelPathname + "/video") &&
            "hover:border-primary border-primary text-primary",
        )}
        asChild
      >
        <Link href={channelPathname + "/video"}>Video</Link>
      </Button>

      <Button
        className={cn(
          "bg-transparent hover:bg-transparent border-b-2 border-transparent text-primary/80 rounded-none hover:border-primary/40",
          pathname.includes(channelPathname + "/playlists") &&
            "hover:border-primary border-primary text-primary",
        )}
        asChild
      >
        <Link href={channelPathname + "/playlists"}>Playlists</Link>
      </Button>
    </div>
  );
};

export default ChannelHeaderNav;
