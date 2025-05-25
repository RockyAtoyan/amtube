"use server";

import { ChannelsApi, CreateChannelDto, UpdateChannelDto } from "./api"

export async function createChannel(dto: CreateChannelDto) {
  try {
    const res = await ChannelsApi.create(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to create channel");
  }
}

export async function findAllChannels(
  page: number,
  searchTerm?: string,
  filter?: "popular" | "alphabet" | "alphabet(desc)",
  limit?: number,
  pagination = true,
) {
  try {
    const res = await ChannelsApi.findAll(
      page,
      searchTerm,
      filter,
      limit,
      pagination,
    );
    return res;
  } catch (error) {
    throw new Error("Failed to fetch channels");
  }
}

export async function findChannelById(id: string) {
  try {
    const res = await ChannelsApi.findById(id);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch channel");
  }
}

export async function findChannelBySlug(slug: string) {
  try {
    const res = await ChannelsApi.findBySlug(slug);
    return res;
  } catch (error) {
    return null;
  }
}

export async function updateChannel(id: string, dto: UpdateChannelDto) {
  try {
    const res = await ChannelsApi.update(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to update channel");
  }
}

export async function deleteChannel(id: string) {
  try {
    const res = await ChannelsApi.delete(id);
    return res;
  } catch (error) {
    throw new Error("Failed to delete channel");
  }
}
