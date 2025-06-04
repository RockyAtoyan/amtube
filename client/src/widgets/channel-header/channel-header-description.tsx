import { ChannelWithRelations } from "@/entities/channel/model/channel-with-relations";
import { cn, formatNumber } from "@/shared/lib";
import { Modal } from "@/shared/ui/modal";
import Separator from "@/shared/ui/separator";

import { FC, useState } from "react";

import { Info, SquarePlay, TrendingUp, Users } from "lucide-react";

import styles from "./channel-header.module.scss";

interface Props {
  channel: ChannelWithRelations;
}

const ChannelHeaderDescription: FC<Props> = ({ channel }) => {
  const [isMore, setIsMore] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <p
          className={cn(styles.description, "text-primary/50")}
          dangerouslySetInnerHTML={{ __html: channel.description }}
        />
        <span
          className="cursor-pointer text-sm"
          onClick={() => setIsMore(true)}
        >
          more
        </span>
      </div>
      <Modal isOpen={isMore} onOpenChange={(value) => setIsMore(value)}>
        <Modal.Header title={channel.title} description="Channel Description" />
        <Modal.Content>
          <p
            className={cn(
              styles.description,
              "!line-clamp-none !max-w-full !text-base",
            )}
            dangerouslySetInnerHTML={{ __html: channel.description }}
          />
          <Separator className="my-3" />
          <div className="text-sm space-y-3">
            <p className="flex items-center gap-3">
              <Info />
              <span>
                Registration date:{" "}
                {new Date(channel.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Users />
              <span>
                {formatNumber(channel.subscribers.length)} subscribers
              </span>
            </p>
            <p className="flex items-center gap-3">
              <SquarePlay />
              <span>{formatNumber(channel.videos.length)} video</span>
            </p>
            <p className="flex items-center gap-3">
              <TrendingUp />
              <span>
                {formatNumber(
                  channel.videos.reduce(
                    (acc, video) => (acc += video.views.length),
                    0,
                  ),
                )}{" "}
                views
              </span>
            </p>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ChannelHeaderDescription;
