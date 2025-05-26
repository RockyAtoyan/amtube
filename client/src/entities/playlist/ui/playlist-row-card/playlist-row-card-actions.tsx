"use client";

import { PublicRoutes } from "@/shared/config/routes/public.routes"
import { StudioRoutes } from "@/shared/config/routes/studio.routes"
import { useAuthStore } from "@/shared/store/auth.store"
import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

import { FC } from "react"
import toast from "react-hot-toast"

import { EllipsisVertical } from "lucide-react"
import Link from "next/link"

import { useDeletePlaylist } from "../../api/hooks"
import { PlaylistWithRelations } from "../../model/playlist-with-relations"

interface Props {
  playlist: PlaylistWithRelations;
  isInStudio?: boolean;
}

const PlaylistRowCardActions: FC<Props> = ({ playlist, isInStudio }) => {
  const { user } = useAuthStore();

  const { deletePlaylist, isPending } = useDeletePlaylist();

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
                {isInStudio && playlist.title !== "Watch later" && (
                  <>
                    <Button asChild>
                      <Link href={StudioRoutes.EDIT_PLAYLIST(playlist.id)}>
                        Edit playlist
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
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
                  </>
                )}
                {isInStudio && playlist.title === "Watch later" && (
                  <p>You can not edit this playlist!</p>
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
