"use client";

import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations";

import { FC } from "react";

import ChannelHeaderBanner from "./channel-header-banner";
import ChannelHeaderInfo from "./channel-header-info";
import ChannelHeaderNav from "./channel-header-nav";

interface Props {
  channel: ChannelWithRelations;
}

const ChannelHeader: FC<Props> = ({ channel }) => {
  return (
    <div className="w-full">
      <ChannelHeaderBanner channel={channel} />
      <ChannelHeaderInfo channel={channel} />
      <ChannelHeaderNav channel={channel} />
    </div>
  );
};

export default ChannelHeader;
