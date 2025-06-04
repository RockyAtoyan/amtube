"use client";

import { useCreateComment, useGetComments } from "@/entities/comment/api/hooks"
import { CommentWithRelations } from "@/entities/comment/model/comment-with-relations"
import CommentCard from "@/entities/comment/ui/comment-card"
import { VideoWithRelations } from "@/entities/video/model/video-with-relations"
import { formatNumber } from "@/shared/lib"
import { useAuthStore } from "@/shared/store/auth.store"
import { Button } from "@/shared/ui/button"
import Input from "@/shared/ui/input"
import { Loader } from "@/shared/ui/loader"

import { FC } from "react"
import toast from "react-hot-toast"

interface Props {
  video: VideoWithRelations;
  comments?: CommentWithRelations[];
}

const VideoComments: FC<Props> = ({ video, comments: initCommets }) => {
  const { user, isPending } = useAuthStore();

  const { comments } = useGetComments(video.id, initCommets);

  const { createComment, isPending: isCreatePending } = useCreateComment();

  const handleCreate = (data: FormData) => {
    const text = data.get("text") as string;
    if (!user) {
      toast.error("You have to sign in!");
      return;
    }
    if (!text.trim()) {
      toast.error("You have to write comment!");
      return;
    }
    createComment({ userId: user.id, videoId: video.id, text });
  };

  if (!comments) return <Loader />;

  return (
    <div className="mt-5">
      <p className="text-xl mb-3">{formatNumber(comments.length)} comments</p>
      {user && (
        <form action={handleCreate}>
          <Input name="text" label="Write comment" required />
          <div className="text-end">
            <Button
              disabled={isCreatePending}
              className="mt-2"
              size="sm"
              type="submit"
            >
              Create comment
            </Button>
          </div>
        </form>
      )}
      <div className="mt-8 space-y-16">
        {!!comments?.length ? (
          comments.map((comment) => {
            return (
              <CommentCard
                key={comment.id}
                comment={comment}
                authId={user?.id}
              />
            );
          })
        ) : (
          <p className="text-lg">There are no comments!</p>
        )}
      </div>
    </div>
  );
};

export default VideoComments;
