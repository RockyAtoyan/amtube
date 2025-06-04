"use client";

import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import { FC } from "react";
import toast from "react-hot-toast";

import { Bookmark, BookmarkX, EllipsisVertical } from "lucide-react";
import Link from "next/link";

import { useDeletePlaylist, useToggleSavePlaylist } from "../../api/hooks";
import { PlaylistWithRelations } from "../../model/playlist-with-relations";

interface Props {
  playlist: PlaylistWithRelations;
  isInStudio?: boolean;
}

const PlaylistRowCardActions: FC<Props> = ({ playlist, isInStudio }) => {
  const { user, isPending } = useAuthStore();

  const { deletePlaylist, isPending: isDeletePending } = useDeletePlaylist();

  const { toggleSavePlaylist, isPending: isTogglePending } =
    useToggleSavePlaylist();

  const loading = isPending || isDeletePending || isTogglePending;

  const isSaved = !!user?.savedPlaylists?.some((p) => p.id === playlist.id);

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
            {user && (
              <>
                {playlist.title !== "Watch later" &&
                  user?.playlists?.some((p) => p.id === playlist.id) && (
                    <>
                      <Button asChild>
                        <Link href={StudioRoutes.EDIT_PLAYLIST(playlist.id)}>
                          Edit playlist
                        </Link>
                      </Button>
                      {isInStudio && (
                        <Button
                          variant="destructive"
                          disabled={loading}
                          onClick={() => {
                            deletePlaylist(playlist.id, {
                              onSuccess() {
                                toast.success(
                                  `Deleted platlist "${playlist.title}"`,
                                );
                              },
                            });
                          }}
                        >
                          Delete playlist
                        </Button>
                      )}
                    </>
                  )}
                {playlist.title === "Watch later" && (
                  <p>You can not do actions with this playlist!</p>
                )}
                {!isInStudio &&
                  !user?.playlists?.some((p) => p.id === playlist.id) &&
                  playlist.title !== "Watch later" && (
                    <Button
                      disabled={loading}
                      className="flex items-center gap-3"
                      onClick={() => {
                        toggleSavePlaylist(
                          {
                            id: playlist.id,
                            dto: {
                              userId: user.id,
                              isSaved,
                              playlistId: playlist.id,
                            },
                          },
                          {
                            onSuccess() {
                              toast.success(
                                !isSaved
                                  ? "Saved playlist!"
                                  : "Unsaved playlist!",
                              );
                            },
                          },
                        );
                      }}
                    >
                      {!isSaved ? (
                        <Bookmark size={16} />
                      ) : (
                        <BookmarkX size={16} />
                      )}
                      {!isSaved ? "Save playlist" : "Unsave playlist"}
                    </Button>
                  )}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PlaylistRowCardActions;
