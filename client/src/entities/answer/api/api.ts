import { authInstance, publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { Answer } from "../model/answer";
import { AnswerWithRelations } from "../model/answer-with-relations";

export interface CreateAnswerDto {
  text: string;
  userId: string;
  commentId: string;
  toId: string;
}
export interface CreateAnswerResponse extends Answer {}

export interface UpdateAnswerDto extends Partial<CreateAnswerDto> {
  userId: string;
}
export type UpdateAnswerResponse = Answer;

export type FindAllAnswerResponse = AnswerWithRelations[];

export type FindOneAnswerResponse = AnswerWithRelations;

export interface ToggleLikeAnswerDto {
  userId: string;
  answerId: string;
  isLiked: boolean;
}

export type ToggleLikeAnswerResponse = Answer;

export class AnswersApi {
  static async create(dto: CreateAnswerDto) {
    const res = await authInstance.post<CreateAnswerResponse>(
      ROUTES.answers.create.path,
      dto,
    );
    return res.data;
  }

  static async findAll() {
    const res = await publicInstance.get<FindAllAnswerResponse>(
      ROUTES.answers.findAll.path,
    );
    return res.data;
  }

  static async findOne(id: string) {
    const res = await publicInstance.get<FindOneAnswerResponse>(
      ROUTES.answers.findOne.path + "/" + id,
    );
    return res.data;
  }

  static async toggleLike(id: string, dto: ToggleLikeAnswerDto) {
    const res = await authInstance.patch<ToggleLikeAnswerResponse>(
      ROUTES.answers.toggleLike.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async update(id: string, dto: UpdateAnswerDto) {
    const res = await authInstance.patch<UpdateAnswerResponse>(
      ROUTES.answers.update.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<UpdateAnswerResponse>(
      ROUTES.answers.delete.path + "/" + id,
    );
    return res.data;
  }
}
