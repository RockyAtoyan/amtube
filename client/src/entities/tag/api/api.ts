import { authInstance, publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { Tag } from "../model/tag";
import { TagWithRelations } from "../model/tag-with-relations";

export interface CreateTagDto {
  name: string;
}
export interface CreateTagResponse extends Tag {}

export type DeleteTagResponse = TagWithRelations;

export interface FindAllTagResponse {
  tags: TagWithRelations[];
  totalCount: number;
}

export type FindOneTagResponse = TagWithRelations;

export class TagsApi {
  static async create(dto: CreateTagDto) {
    const res = await authInstance.post<CreateTagResponse>(
      ROUTES.tags.create.path,
      dto,
    );
    return res.data;
  }

  static async findAll(page: number, searchTerm?: string, limit?: number) {
    const res = await publicInstance.get<FindAllTagResponse>(
      ROUTES.tags.findAll.path,
      {
        params: {
          page,
          searchTerm,
          limit,
        },
      },
    );
    return res.data;
  }

  static async findById(id: string) {
    const res = await publicInstance.get<FindOneTagResponse>(
      ROUTES.tags.findOne.path + "/" + id,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<DeleteTagResponse>(
      ROUTES.tags.delete.path + "/" + id,
    );
    return res.data;
  }
}
