export interface VideoSummary {
  id: string;
  userId?: number | null;
  username?: string | null;
  title: string;
  filename: string;
  originalName: string;
  mimeType: string;
  uploadedAt: string;
  description: string | null;
  sharedAt?: string;
  sharedByUsername?: string;
}

export interface AppUser {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

export interface VideoComment {
  id: number;
  videoId: string;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  username: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  videoId: string;
  title: string;
  channelUserId: number;
  channelUsername: string;
  createdAt: string;
  readAt: string | null;
}

export type AuthMode = "login" | "register";
