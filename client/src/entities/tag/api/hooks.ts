import { useMutation, useQuery } from "@tanstack/react-query";

import { TagsApi } from "./api";

export const useGetTags = (
  page: number,
  searchTerm?: string,
  limit?: number,
) => {
  const { data: tags, ...rest } = useQuery({
    queryKey: ["tags", page, searchTerm, limit],
    queryFn: () => TagsApi.findAll(page, searchTerm, limit),
  });

  return { tags, ...rest };
};

export const useGetTag = (id: string) => {
  const { data: tag, ...rest } = useQuery({
    queryKey: ["tag", id],
    queryFn: () => TagsApi.findById(id),
  });

  return { tag, ...rest };
};

export const useCreateTag = () => {
  const { mutate: createTag, ...rest } = useMutation({
    mutationFn: TagsApi.create,
  });

  return { createTag, ...rest };
};

export const useDeleteTag = () => {
  const { mutate: deleteTag, ...rest } = useMutation({
    mutationFn: (id: string) => TagsApi.delete(id),
  });

  return { deleteTag, ...rest };
};
