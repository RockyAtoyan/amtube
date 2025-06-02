"use client";

import { useGetChannelBySlug } from "@/entities/channel/api/hooks";
import VideoRowSheet, {
  VideoRowSkeletonSheet,
} from "@/features/video-row-sheet/video-row-sheet";
import { useAuthStore } from "@/shared/store/auth.store";
import { Loader } from "@/shared/ui/loader";

import { Library } from "lucide-react";

import UnauthorizedForm from "../unauthorized-form/unauthorized-form";

const LibraryVideos = () => {
  const { user, isPending } = useAuthStore();

  const { channel, isLoading } = useGetChannelBySlug(user?.channel?.slug || "");

  const loading = isLoading || isPending;

  if (!user && !loading) {
    return <UnauthorizedForm />;
  }

  if (!user && loading) {
    return <Loader />;
  }

  return (
    <div>
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <Library className="text-accent" size={24} /> Your video
      </h2>
      {loading && <VideoRowSkeletonSheet />}
      {!loading && !!channel?.videos?.length && (
        <VideoRowSheet isInStudio videos={channel.videos} />
      )}
      {!loading && !channel?.videos?.length && (
        <p className="text-lg">There are no video!</p>
      )}
    </div>
  );
};

export default LibraryVideos;
