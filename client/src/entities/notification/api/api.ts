import { authInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { Notification } from "../model/notification";
import { NotificationWithRelations } from "../model/notification-with-relations";

export interface CreateNotificationDto {
  text: string;
  userId: string;
  link?: string;
}
export interface CreateNotificationResponse extends Notification {}

export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {}
export type UpdateNotificationResponse = Notification;

export type FindAllNotificationResponse = NotificationWithRelations[];

export type FindOneNotificationResponse = NotificationWithRelations;

export interface ToggleLikeNotificationDto {
  userId: string;
  notificationId: string;
  isLiked: boolean;
}

export type ToggleLikeNotificationResponse = Notification;

export class NotificationsApi {
  static async create(dto: CreateNotificationDto) {
    const res = await authInstance.post<CreateNotificationResponse>(
      ROUTES.notifications.create.path,
      dto,
    );
    return res.data;
  }

  static async update(id: string, dto: UpdateNotificationDto) {
    const res = await authInstance.patch<UpdateNotificationResponse>(
      ROUTES.notifications.update.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<UpdateNotificationResponse>(
      ROUTES.notifications.delete.path + "/" + id,
    );
    return res.data;
  }
}
