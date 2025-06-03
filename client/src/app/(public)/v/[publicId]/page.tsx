import { findAllComments } from "@/entities/comment/api/actions";
import { findPlaylistById } from "@/entities/playlist/api/actions";
import {
  findVideoByPublicId,
  getAllVideosForGenerate,
} from "@/entities/video/api/actions";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import SimilarVideos from "@/widgets/similar-videos/similar-videos";
import VideoComments from "@/widgets/video-comments/video-comments";
import VideoInfo from "@/widgets/video-player/video-info";
import VideoPlayer from "@/widgets/video-player/video-player";
import VideoPlaylistList from "@/widgets/video-playlist-list/video-playlist-list";

import { redirect } from "next/navigation";

export const revalidate = 100;

export async function generateStaticParams() {
  //@ts-ignore
  const videos = await getAllVideosForGenerate();
  return videos?.map?.((video) => ({
    publicId: video?.publicId,
  }));
}

export default async function VideoPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { publicId } = await params;
  const playlistId = (await searchParams).list as string;

  const video = await findVideoByPublicId(publicId);

  if (!video) redirect(PublicRoutes.HOME);

  const comments = await findAllComments(video.id);
  const playlist = playlistId ? await findPlaylistById(playlistId) : undefined;

  return (
    <div className="flex gap-3">
      <div className="w-2/3">
        <VideoPlayer video={video} playlist={playlist} />
        <VideoInfo video={video} />
        <VideoComments video={video} comments={comments || undefined} />
      </div>
      <div className="w-1/3">
        <div className="pl-16">
          {playlist && <VideoPlaylistList playlist={playlist} video={video} />}
          <SimilarVideos video={video} />
        </div>
      </div>
    </div>
  );
}
