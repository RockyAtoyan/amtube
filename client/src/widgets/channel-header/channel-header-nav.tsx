"use client";

import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations"
import RowNav from "@/features/row-nav/row-nav"
import { PublicRoutes } from "@/shared/config/routes/public.routes"

import { FC } from "react"


interface Props {
  channel: ChannelWithRelations;
}

const ChannelHeaderNav: FC<Props> = ({ channel }) => {
  const channelPathname = PublicRoutes.CHANNEL(channel.slug);

  return (
    <div className="mt-3 mb-5">
      <RowNav
        items={[
          { label: "Home", pathname: channelPathname, isHome: true },
          {
            label: "Video",
            pathname: channelPathname + "/video",
          },
          {
            label: "Playlists",
            pathname: channelPathname + "/playlists",
          },
        ]}
      />
    </div>
  );
};

export default ChannelHeaderNav;
