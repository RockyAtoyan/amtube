"use server";

import { CreateTagDto, TagsApi } from "./api";

export async function createTag(dto: CreateTagDto) {
  try {
    const res = await TagsApi.create(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to create tag");
  }
}

export async function findAllTags(
  page: number,
  searchTerm?: string,
  limit?: number,
) {
  try {
    const res = await TagsApi.findAll(page, searchTerm, limit);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch tags");
  }
}

export async function findTagById(id: string) {
  try {
    const res = await TagsApi.findById(id);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch tag");
  }
}

export async function deleteTag(id: string) {
  try {
    const res = await TagsApi.delete(id);
    return res;
  } catch (error) {
    throw new Error("Failed to delete tag");
  }
}
