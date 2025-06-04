"use client";

import VideoRowSheet, {
  VideoRowSkeletonSheet,
} from "@/features/video-row-sheet/video-row-sheet";
import { useAuthStore } from "@/shared/store/auth.store";
import { Loader } from "@/shared/ui/loader";
import UnauthorizedForm from "@/widgets/unauthorized-form/unauthorized-form";

import { Clock } from "lucide-react";

const WatchLaterVideos = () => {
  const { user, isPending } = useAuthStore();

  const playlist = user?.playlists?.find(
    (playlist) => playlist.title === "Watch later",
  );
  const videos = playlist?.videos;

  if (!user && !isPending) {
    return <UnauthorizedForm />;
  }

  if (!user && isPending) {
    return <Loader />;
  }

  return (
    <div>
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <Clock className="text-accent" size={24} /> Watch Later
      </h2>
      {isPending && <VideoRowSkeletonSheet />}
      {!isPending &&
        (videos && !!videos?.length ? (
          <VideoRowSheet fromPlaylistId={playlist.id} videos={videos} />
        ) : (
          <p className="text-lg">There are no video!</p>
        ))}
    </div>
  );
};

export default WatchLaterVideos;
