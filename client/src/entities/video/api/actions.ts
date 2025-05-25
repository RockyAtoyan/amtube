"use server";

import { type UpdateVideoDto, VideosApi } from "./api";

export async function processVideoFile(formData: FormData) {
  try {
    const res = await VideosApi.processVideoFile(formData);
    return res;
  } catch (error) {
    throw new Error("Failed to process video file");
  }
}

export async function findAllVideos(page: string, limit: string) {
  try {
    const res = await VideosApi.findAll(
      Number(page),
      undefined,
      undefined,
      Number(limit),
    );
    return res;
  } catch (error) {
    throw new Error("Failed to fetch videos");
  }
}

export async function getTrendingVideos(page: string, limit: string) {
  try {
    const res = await VideosApi.getTrending(Number(page), Number(limit));
    return res;
  } catch (error) {
    throw new Error("Failed to fetch trending videos");
  }
}

export async function getExploreVideos() {
  try {
    const res = await VideosApi.getExplore({ pageParam: 0 });
    return res;
  } catch (error) {
    throw new Error("Failed to fetch explore videos");
  }
}

export async function findVideoById(id: string) {
  try {
    const res = await VideosApi.findOne(id);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch video");
  }
}

export async function updateVideo(id: string, dto: UpdateVideoDto) {
  try {
    const res = await VideosApi.update(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to update video");
  }
}

export async function deleteVideo(id: string) {
  try {
    const res = await VideosApi.delete(id);
    return res;
  } catch (error) {
    throw new Error("Failed to delete video");
  }
}
