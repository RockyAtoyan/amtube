"use client";

import { useGetUserLikedVideos } from "@/entities/user/api/hooks";
import VideoRowSheet, {
  VideoRowSkeletonSheet,
} from "@/features/video-row-sheet/video-row-sheet";
import { useAuthStore } from "@/shared/store/auth.store";
import { Loader } from "@/shared/ui/loader";

import { ThumbsUp } from "lucide-react";

import UnauthorizedForm from "../unauthorized-form/unauthorized-form";

const LikedVideos = () => {
  const { user, isPending } = useAuthStore();

  const { likedVideos, isLoading } = useGetUserLikedVideos();

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
        <ThumbsUp className="text-accent" size={24} /> Liked video
      </h2>
      {loading && <VideoRowSkeletonSheet />}
      {!loading && !!likedVideos?.length && (
        <VideoRowSheet isInStudio videos={likedVideos} />
      )}
      {!loading && !likedVideos?.length && (
        <p className="text-lg">There are no video!</p>
      )}
    </div>
  );
};

export default LikedVideos;
