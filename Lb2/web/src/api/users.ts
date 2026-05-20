import { apiClient } from "./client";
import type { AppUser } from "../types";

interface UserResponse {
  readonly user: AppUser;
}

export async function fetchCurrentUser(): Promise<AppUser | null> {
  try {
    const response = await apiClient.get<UserResponse, { data: UserResponse }>(
      "/users/me",
    );

    return response.data.user;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("status=401")) {
      return null;
    }

    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AppUser> {
  const response = await apiClient.post<UserResponse, { data: UserResponse }>(
    "/users/login",
    {
      email,
      password,
    },
  );

  return response.data.user;
}

export async function registerUser(
  email: string,
  username: string,
  password: string,
): Promise<AppUser> {
  const response = await apiClient.post<UserResponse, { data: UserResponse }>(
    "/users/register",
    {
      email,
      username,
      password,
    },
  );

  return response.data.user;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post("/users/logout");
}
