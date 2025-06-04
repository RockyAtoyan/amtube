import { useToggleVideoToPlaylist } from "@/entities/playlist/api/hooks";
import CreatePlaylistForm from "@/features/create-playlist-form/create-playlist-form";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { cn } from "@/shared/lib";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import Separator from "@/shared/ui/separator";

import { FC, useState } from "react";
import toast from "react-hot-toast";

import {
  Bookmark,
  Check,
  CircleX,
  Clock,
  EllipsisVertical,
} from "lucide-react";
import Link from "next/link";

import { VideoWithRelations } from "../../model/video-with-relations";

interface Props {
  video: VideoWithRelations;
  editPlaylistId?: string;
  isInStudio?: boolean;
}

const VideoRowCardActions: FC<Props> = ({
  video,
  editPlaylistId,
  isInStudio,
}) => {
  const { user } = useAuthStore();

  const { toggleVideoToPlaylist, isPending } = useToggleVideoToPlaylist();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddingToChannel, setIsAddingToChannel] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button size={"icon"} variant="ghost">
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-3">
            {!user && (
              <Button asChild>
                <Link href={PublicRoutes.SIGN_IN}>You have to sign in!</Link>
              </Button>
            )}
            {user && !editPlaylistId && (
              <>
                {isInStudio && (
                  <>
                    <Button asChild>
                      <Link href={StudioRoutes.EDIT_VIDEO(video.id)}>
                        Edit video
                      </Link>
                    </Button>
                    <Separator />
                  </>
                )}
                <Button
                  className="flex items-center gap-2"
                  variant={"outline"}
                  onClick={() => {
                    const watchLaterPlaylist = user?.playlists?.find(
                      (playlist) => playlist.title === "Watch later",
                    );
                    const isIn = video.playlists.some(
                      (playlist) => playlist.id === watchLaterPlaylist?.id,
                    );
                    if (!isIn && watchLaterPlaylist) {
                      toggleVideoToPlaylist(
                        {
                          id: watchLaterPlaylist.id,
                          dto: {
                            isAdded: isIn,
                            playlistId: watchLaterPlaylist.id,
                            videoId: video.id,
                          },
                        },
                        {
                          onSuccess(data, variables, context) {
                            toast.success(`Added to playlist "${data.title}"!`);
                          },
                        },
                      );
                    } else {
                      setIsOpen(true);
                      setIsAddingToChannel(false);
                      setIsCreatingPlaylist(false);
                    }
                  }}
                >
                  <Clock /> Watch later
                </Button>
                <Button
                  className="flex items-center gap-2"
                  variant={"outline"}
                  onClick={() => setIsOpen(true)}
                >
                  <Bookmark /> Add to playlist
                </Button>
                {user?.channel && (
                  <>
                    <Separator />
                    <Button
                      className="flex items-center gap-2"
                      variant={"outline"}
                      onClick={() => {
                        setIsAddingToChannel(true);
                        setIsOpen(true);
                      }}
                    >
                      Add to channel's playlist
                    </Button>
                  </>
                )}
              </>
            )}
            {user && editPlaylistId && (
              <Button
                className="flex items-center gap-2"
                variant={"destructive"}
                onClick={() => {
                  toggleVideoToPlaylist(
                    {
                      id: editPlaylistId,
                      dto: {
                        isAdded: true,
                        playlistId: editPlaylistId,
                        videoId: video.id,
                      },
                    },
                    {
                      onSuccess(data, variables, context) {
                        toast.success(`Removed from playlist "${data.title}"!`);
                      },
                    },
                  );
                }}
              >
                <CircleX /> Remove
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {user && !editPlaylistId && (
        <Modal
          isOpen={isOpen}
          onOpenChange={(value) => {
            setIsOpen(value);
            if (!value) {
              setTimeout(() => {
                setIsCreatingPlaylist(false);
                setIsAddingToChannel(false);
              }, 100);
            }
          }}
          className={cn(!isCreatingPlaylist && "max-w-[18rem]")}
        >
          <Modal.Header
            title={!isCreatingPlaylist ? "Choose playlist" : "Create playlist"}
          />
          <Modal.Content>
            {!isCreatingPlaylist && !isAddingToChannel && (
              <div className="flex flex-col gap-3">
                {!!user?.playlists?.length ? (
                  <div className="flex flex-col gap-3 items-start max-h-[11.25rem] overflow-auto">
                    {user.playlists
                      .filter((playlist) => !playlist?.channelId)
                      .map((playlist) => {
                        const isIn = !!video?.playlists?.find(
                          (pl) => pl.id === playlist.id,
                        );
                        return (
                          <Button
                            variant="link"
                            key={playlist.id}
                            onClick={() => {
                              toggleVideoToPlaylist(
                                {
                                  id: playlist.id,
                                  dto: {
                                    isAdded: isIn,
                                    playlistId: playlist.id,
                                    videoId: video.id,
                                  },
                                },
                                {
                                  onSuccess(data, variables, context) {
                                    toast.success(
                                      !isIn
                                        ? `Added to playlist "${data.title}"!`
                                        : `Removed from playlist "${data.title}"!`,
                                    );
                                  },
                                },
                              );
                            }}
                          >
                            <span
                              className={cn(
                                "flex flex-shrink-0 items-center justify-center mr-3 w-6 h-6 border border-primary rounded text-background",
                                isIn && "border-accent bg-accent",
                              )}
                            >
                              {isIn && <Check />}
                            </span>
                            <span className="line-clamp-1 max-w-[10rem]">
                              {playlist.title}
                            </span>
                          </Button>
                        );
                      })}
                  </div>
                ) : (
                  <p className="my-6"> You do not have any playlists!</p>
                )}
                <Button
                  className="block w-full"
                  onClick={() => {
                    setIsCreatingPlaylist(true);
                  }}
                >
                  Create new playlist
                </Button>
              </div>
            )}
            {!isCreatingPlaylist && isAddingToChannel && (
              <div className="flex flex-col gap-3">
                {!!user?.channel?.playlists?.length ? (
                  <div className="flex flex-col gap-3 items-start max-h-[11.25rem] overflow-auto">
                    {user.channel.playlists.map((playlist) => {
                      const isIn = !!video?.playlists?.find(
                        (pl) => pl.id === playlist.id,
                      );
                      return (
                        <Button
                          variant="link"
                          key={playlist.id}
                          onClick={() => {
                            toggleVideoToPlaylist(
                              {
                                id: playlist.id,
                                dto: {
                                  isAdded: isIn,
                                  playlistId: playlist.id,
                                  videoId: video.id,
                                },
                              },
                              {
                                onSuccess(data, variables, context) {
                                  toast.success(
                                    !isIn
                                      ? `Added to playlist "${data.title}"!`
                                      : `Removed from playlist "${data.title}"!`,
                                  );
                                },
                              },
                            );
                          }}
                        >
                          <span
                            className={cn(
                              "flex flex-shrink-0 items-center justify-center mr-3 w-6 h-6 border border-primary rounded text-background",
                              isIn && "border-accent bg-accent",
                            )}
                          >
                            {isIn && <Check />}
                          </span>
                          <span className="line-clamp-1 max-w-[10rem]">
                            {playlist.title}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="my-6">
                    {" "}
                    Your channel do not has any playlists!
                  </p>
                )}
              </div>
            )}
            {isCreatingPlaylist && (
              <CreatePlaylistForm
                loading={isPending}
                onSuccess={(data) => {
                  toggleVideoToPlaylist(
                    {
                      id: data.id,
                      dto: {
                        isAdded: false,
                        playlistId: data.id,
                        videoId: video.id,
                      },
                    },
                    {
                      onSuccess(data, variables, context) {
                        setIsOpen(false);
                        setIsAddingToChannel(false);
                        setIsCreatingPlaylist(false);
                        toast.success(`Added to playlist "${data.title}"!`);
                      },
                    },
                  );
                }}
              />
            )}
          </Modal.Content>
        </Modal>
      )}
    </>
  );
};

export default VideoRowCardActions;
