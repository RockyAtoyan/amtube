import { authInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { useMutation } from "@tanstack/react-query";

export type UploadMediaPath =
  | "/playlists-thumbnails"
  | "/videos-thumbnails"
  | "/users-avatars"
  | "/channels-avatars"
  | "/channels-banners";

export interface UploadMediaDto {
  uploadPath: UploadMediaPath;
  filename: string;
  file: File;
}

export const useUploadMedia = () => {
  const {
    mutateAsync: uploadMedia,
    isPending: isMediaUploading,
    ...rest
  } = useMutation({
    mutationFn: async (payload: UploadMediaDto) => {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("uploadPath", payload.uploadPath);
      formData.append("filename", payload.filename);
      const res = await authInstance.post<string>(
        ROUTES.media.upload.path,
        formData,
      );
      return res.data;
    },
  });
  return { uploadMedia, isMediaUploading, ...rest };
};
