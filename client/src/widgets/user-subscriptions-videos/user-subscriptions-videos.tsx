"use client";

import { useGetUserSubscribesVideos } from "@/entities/user/api/hooks";
import VideoSheet, {
  VideoSkeletonSheet,
} from "@/features/video-sheet/video-sheet";
import { useAuthStore } from "@/shared/store/auth.store";
import { Loader } from "@/shared/ui/loader";
import UnauthorizedForm from "@/widgets/unauthorized-form/unauthorized-form";

import { ListVideo } from "lucide-react";

const UserSubscriptionsVideos = () => {
  const { user, isPending: isAuthPending } = useAuthStore();

  const { subscribesVideos, isLoading } = useGetUserSubscribesVideos();

  const isPending = isAuthPending || isLoading;

  if (!user && !isPending) {
    return <UnauthorizedForm />;
  }

  if (!user && isPending) {
    return <Loader />;
  }

  return (
    <div>
      <h2 className="text-xl mb-8 flex items-center gap-3">
        <ListVideo className="text-accent" size={24} /> Subscriptions
      </h2>
      {isPending && <VideoSkeletonSheet />}
      {!isPending &&
        (!!subscribesVideos?.length ? (
          <VideoSheet videos={subscribesVideos} />
        ) : (
          <p className="text-lg">There are no video!</p>
        ))}
    </div>
  );
};

export default UserSubscriptionsVideos;
