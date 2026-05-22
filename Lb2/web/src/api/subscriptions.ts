import type { Subscription } from "../types";
import { apiClient } from "./client";

export async function fetchSubscriptions(): Promise<Subscription[]> {
  const response = await apiClient.get<Subscription[]>("/subscriptions");

  return response.data;
}

export async function subscribeToUser(username: string): Promise<Subscription> {
  const response = await apiClient.post<
    { subscription: Subscription },
    { data: { subscription: Subscription } }
  >("/subscriptions", {
    username,
  });

  return response.data.subscription;
}

export async function unsubscribeFromUser(username: string): Promise<void> {
  await apiClient.delete(`/subscriptions/${encodeURIComponent(username)}`);
}
