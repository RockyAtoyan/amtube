"use server";

import {
  type CreateNotificationDto,
  NotificationsApi,
  type UpdateNotificationDto,
} from "./api";

export async function createNotification(dto: CreateNotificationDto) {
  try {
    const res = await NotificationsApi.create(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to create notification");
  }
}

export async function updateNotification(
  id: string,
  dto: UpdateNotificationDto,
) {
  try {
    const res = await NotificationsApi.update(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to update notification");
  }
}

export async function deleteNotification(id: string) {
  try {
    const res = await NotificationsApi.delete(id);
    return res;
  } catch (error) {
    throw new Error("Failed to delete notification");
  }
}
