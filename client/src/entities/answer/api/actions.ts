"use server";

import {
  AnswersApi,
  type CreateAnswerDto,
  type ToggleLikeAnswerDto,
  type UpdateAnswerDto,
} from "./api";

export async function createAnswer(dto: CreateAnswerDto) {
  try {
    const res = await AnswersApi.create(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to create answer");
  }
}

export async function findAllAnswers() {
  try {
    const res = await AnswersApi.findAll();
    return res;
  } catch (error) {
    throw new Error("Failed to fetch answers");
  }
}

export async function findAnswerById(id: string) {
  try {
    const res = await AnswersApi.findOne(id);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch answer");
  }
}

export async function toggleLikeAnswer(id: string, dto: ToggleLikeAnswerDto) {
  try {
    const res = await AnswersApi.toggleLike(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to toggle like answer");
  }
}

export async function updateAnswer(id: string, dto: UpdateAnswerDto) {
  try {
    const res = await AnswersApi.update(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to update answer");
  }
}

export async function deleteAnswer(id: string) {
  try {
    const res = await AnswersApi.delete(id);
    return res;
  } catch (error) {
    throw new Error("Failed to delete answer");
  }
}
