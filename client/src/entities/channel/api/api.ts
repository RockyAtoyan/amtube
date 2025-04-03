import { authInstance, publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { Channel } from "../model/channel";
import { ChannelWithRelations } from "../model/channel-with-relations";

export interface CreateChannelDto {
  title: string;
  slug: string;
  description: string;
  userId: string;
}
export interface CreateChannelResponse extends Channel {}

export interface UpdateChannelDto extends Partial<CreateChannelDto> {}
export type UpdateChannelResponse = Channel;

export type FindAllChannelResponse = {
  channels: ChannelWithRelations[];
  totalCount: number;
};

export type FindOneChannelResponse = ChannelWithRelations;

export class ChannelsApi {
  static async create(dto: CreateChannelDto) {
    const res = await authInstance.post<CreateChannelResponse>(
      ROUTES.channels.create.path,
      dto,
    );
    return res.data;
  }

  static async findAll(
    page: number,
    searchTerm?: string,
    filter?: "popular" | "alphabet" | "alphabet(desc)",
    limit?: number,
  ) {
    const res = await publicInstance.get<FindAllChannelResponse>(
      ROUTES.channels.findAll.path,
      {
        params: {
          page,
          searchTerm,
          filter,
          limit,
        },
      },
    );
    return res.data;
  }

  static async findById(id: string) {
    const res = await publicInstance.get<FindOneChannelResponse>(
      ROUTES.channels.findById.path + "/" + id,
    );
    return res.data;
  }

  static async findBySlug(slug: string) {
    const res = await publicInstance.get<FindOneChannelResponse>(
      ROUTES.channels.findBySlug.path + "/" + slug,
    );
    return res.data;
  }

  static async update(id: string, dto: UpdateChannelDto) {
    const res = await authInstance.patch<UpdateChannelResponse>(
      ROUTES.channels.update.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<UpdateChannelResponse>(
      ROUTES.channels.delete.path + "/" + id,
    );
    return res.data;
  }
}
