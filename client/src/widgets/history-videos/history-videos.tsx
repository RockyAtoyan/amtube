"use client";

import { useGetUserHistory } from "@/entities/user/api/hooks";
import VideoSheet, {
  VideoSkeletonSheet,
} from "@/features/video-sheet/video-sheet";
import { useAuthStore } from "@/shared/store/auth.store";
import { Loader } from "@/shared/ui/loader";
import UnauthorizedForm from "@/widgets/unauthorized-form/unauthorized-form";

import { History } from "lucide-react";

const HistoryVideos = () => {
  const { user, isPending: isAuthPending } = useAuthStore();

  const { history, isLoading } = useGetUserHistory();

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
        <History className="text-accent" size={24} /> History
      </h2>
      {isPending && <VideoSkeletonSheet />}
      {!isPending &&
        (!!history?.length ? (
          <VideoSheet videos={history} />
        ) : (
          <p className="text-lg">There are no video!</p>
        ))}
    </div>
  );
};

export default HistoryVideos;
