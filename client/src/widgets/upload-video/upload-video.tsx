"use client";

import { useAuthStore } from "@/shared/store/auth.store";
import { Loader } from "@/shared/ui/loader";

import UploadVideoForm from "./ui/upload-video-form";

const UploadVideo = () => {
  const { user, isPending } = useAuthStore();

  if (isPending) return <Loader />;

  if (!user?.channel) return <h2>Create channel!</h2>;

  return <UploadVideoForm channelId={user.channel.id} />;
};

export default UploadVideo;
