import { Video } from "@/entities/video/model/video";
import { authInstance, publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { User } from "../model/user";
import { UserWithRelations } from "../model/user-with-relations";

export interface SignUpDto {
  email: string;
  name: string;
  password: string;
}
export interface SignUpResponse extends User {}

export interface SignInDto {
  email: string;
  password: string;
}
export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: UserWithRelations;
}

export interface GetProfileResponse extends UserWithRelations {}

export type SendActivateEmailResponse = { success: boolean };
export type RefreshAccessTokenResponse = { accessToken: string };

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}
export interface CreateUserResponse extends User {}

export interface UpdateUserDto extends Partial<User> {}
export type UpdateUserResponse = UserWithRelations;

export type FindOneUserResponse = UserWithRelations;

export type GetUserHistoryResponse = Video[];
export type GetUserSubscribesVideosResponse = Video[];

export interface BanUserDto {
  isBanned: boolean;
}
export type BanUserResponse = User;

export interface AddVideoToHistoryDto {
  userId: string;
  videoId: string;
}
export type AddVideoToHistoryResponse = Video;

export interface ToggleChannelSubscribeDto {
  userId: string;
  channelId: string;
  isSubscribed: boolean;
}
export type ToggleChannelSubscribeDtoResponse = User;

export class UsersApi {
  static async signUp(dto: SignUpDto) {
    const res = await publicInstance.post<SignUpResponse>(
      ROUTES.auth.signUp.path,
      dto,
    );
    return res.data;
  }

  static async signIn(dto: SignInDto) {
    const res = await publicInstance.post<SignInResponse>(
      ROUTES.auth.signIn.path,
      dto,
    );
    return res.data;
  }

  static async getProfile() {
    const res = await authInstance.get<GetProfileResponse>(
      ROUTES.auth.profile.path,
    );
    return res.data;
  }

  static async logout() {
    const res = await publicInstance.post<void>(ROUTES.auth.logout.path);
    return res.data;
  }

  static async sendActivateEmail(userId: string) {
    const res = await authInstance.get<SendActivateEmailResponse>(
      ROUTES.auth.sendActivateEmail.path,
      {
        params: {
          userId,
        },
      },
    );
    return res.data;
  }

  static async refreshAccessToken() {
    const res = await publicInstance.get<RefreshAccessTokenResponse>(
      ROUTES.auth.refreshAccessToken.path,
    );
    return res.data;
  }

  static async create(dto: CreateUserDto) {
    const res = await publicInstance.post<CreateUserResponse>(
      ROUTES.users.create.path,
      dto,
    );
    return res.data;
  }

  static async findById(id: string) {
    const res = await publicInstance.get<FindOneUserResponse>(
      ROUTES.users.findById.path + "/" + id,
    );
    return res.data;
  }

  static async findByEmail(email: string) {
    const res = await publicInstance.get<FindOneUserResponse>(
      ROUTES.users.findByEmail.path + "/" + email,
    );
    return res.data;
  }

  static async findBySlug(slug: string) {
    const res = await publicInstance.get<FindOneUserResponse>(
      ROUTES.users.findBySlug.path + "/" + slug,
    );
    return res.data;
  }

  static async getUserHistory() {
    const res = await authInstance.get<GetUserHistoryResponse>(
      ROUTES.users.getUserSubscribesVideos.path,
    );
    return res.data;
  }

  static async getUserSubscribesVideos() {
    const res = await authInstance.get<GetUserSubscribesVideosResponse>(
      ROUTES.users.getUserHistory.path,
    );
    return res.data;
  }

  static async update(id: string, dto: UpdateUserDto) {
    const res = await authInstance.patch<UpdateUserResponse>(
      ROUTES.users.update.path,
      dto,
      {
        params: {
          userId: id,
        },
      },
    );
    return res.data;
  }

  static async banUser(id: string, dto: BanUserDto) {
    const res = await authInstance.patch<BanUserResponse>(
      ROUTES.users.banUser.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async addVideoToHistory(dto: AddVideoToHistoryDto) {
    const res = await authInstance.patch<AddVideoToHistoryResponse>(
      ROUTES.users.addVideoToHistory.path,
      dto,
    );
    return res.data;
  }

  static async toggleChannelSubscribe(dto: ToggleChannelSubscribeDto) {
    const res = await authInstance.patch<ToggleChannelSubscribeDtoResponse>(
      ROUTES.users.toggleChannelSubscribe.path,
      dto,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<UpdateUserResponse>(
      ROUTES.users.delete.path + "/" + id,
    );
    return res.data;
  }
}
