import type { Notification } from "../types";
import { apiClient } from "./client";

export async function fetchNotifications(): Promise<Notification[]> {
  const response = await apiClient.get<Notification[]>("/notifications");

  return response.data;
}

export async function markNotificationRead(
  notificationId: number,
): Promise<Notification> {
  const response = await apiClient.patch<
    { notification: Notification },
    { data: { notification: Notification } }
  >(`/notifications/${notificationId}/read`);

  return response.data.notification;
}
