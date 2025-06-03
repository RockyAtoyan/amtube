"use client";

import { cn, formatDateRelative, getChannelLogoLetters } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import Input from "@/shared/ui/input";

import { FC, useState } from "react";
import toast from "react-hot-toast";

import { Trash } from "lucide-react";
import Image from "next/image";

import { useDeleteComment, useUpdateComment } from "../api/hooks";
import { CommentWithRelations } from "../model/comment-with-relations";

interface Props {
  comment: CommentWithRelations;
  authId?: string;
}

const CommentCard: FC<Props> = ({ comment, authId }) => {
  const { updateComment, isPending: isUpdatePending } = useUpdateComment();
  const { deleteComment, isPending: isDeletePending } = useDeleteComment();

  const loading = isUpdatePending || isDeletePending;

  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(comment.text);

  const handleDoubleClick = () => {
    if (authId !== comment.userId || loading) return;
    setEditMode(true);
  };

  return (
    <div className="flex gap-3">
      <Button
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-[15%] overflow-hidden flex items-center justify-center",
          !comment.user.avatarUrl && "bg-primary",
        )}
        variant={"link"}
        size="icon"
      >
        {!comment.user.avatarUrl && (
          <span className="font-semibold text-lg text-background">
            {getChannelLogoLetters(comment.user.name)}
          </span>
        )}
        {comment.user.avatarUrl && (
          <Image
            src={
              `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
              comment.user.avatarUrl
            }
            alt={comment.user.name}
            width={32}
            height={32}
            className="w-full h-full object-cover object-center "
          />
        )}
      </Button>
      <div className="w-full">
        <p className="flex items-end gap-3">
          <span className="line-clamp-1 max-w-[9.375rem] font-semibold">
            {comment.user.name}
          </span>{" "}
          <span className="text-sm">
            {formatDateRelative(comment.createdAt)}
          </span>
        </p>
        {!editMode && (
          <p className="mt-1" onDoubleClick={handleDoubleClick}>
            {comment.text}
          </p>
        )}
        {editMode && (
          <Input
            autoFocus
            className="mt-1 w-full"
            label="Edit comment"
            value={editValue}
            onChange={(e) => setEditValue(e.currentTarget.value)}
            onBlur={() => {
              setEditMode(false);
              setEditValue(comment.text);
            }}
            disabled={loading}
            onKeyUp={(e) => {
              if (e.key !== "Enter" || !authId) return;
              if (!editValue.trim()) {
                toast.error("Fill input!");
                return;
              }
              updateComment(
                {
                  id: comment.id,
                  dto: {
                    videoId: comment.videoId,
                    userId: authId,
                    text: editValue,
                  },
                },
                {
                  onSuccess() {
                    setEditMode(false);
                    toast.success("Edited comment!");
                  },
                },
              );
            }}
          />
        )}
        {authId === comment.userId && (
          <div className="text-end">
            <Button
              size={"icon"}
              variant={"destructive"}
              disabled={loading}
              onClick={() => {
                deleteComment({id:comment.id, authId}, {onSuccess() {
                  toast.success("Deleted comment!")
                }});
              }}
            >
              <Trash />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
