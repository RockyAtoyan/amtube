"use client";

import { useAuthStore } from "@/shared/store/auth.store";

import UploadVideoForm from "./ui/upload-video-form";

const UploadVideo = () => {
  const { user } = useAuthStore();

  if (!user?.channel) return <h2>Create channel!</h2>;

  return <UploadVideoForm channelId={user.channel.id} />;
};

export default UploadVideo;
