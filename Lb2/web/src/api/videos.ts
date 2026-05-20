import type { VideoComment, VideoSummary } from "../types";
import { apiBaseUrl, apiClient } from "./client";

export async function fetchVideos(): Promise<VideoSummary[]> {
  const response = await apiClient.get<VideoSummary[]>("/videos");

  return response.data;
}

export async function fetchSharedVideos(): Promise<VideoSummary[]> {
  const response = await apiClient.get<VideoSummary[]>("/videos/shared");

  return response.data;
}

export function getVideoStreamUrl(videoId: string): string {
  return `${apiBaseUrl}/videos/${encodeURIComponent(videoId)}`;
}

export async function uploadVideo(formData: FormData): Promise<void> {
  await apiClient.post("/videos", formData);
}

export async function shareVideo(
  videoId: string,
  username: string,
): Promise<void> {
  await apiClient.post(`/videos/${encodeURIComponent(videoId)}/share`, {
    username,
  });
}

export async function fetchVideoComments(
  videoId: string,
): Promise<VideoComment[]> {
  const response = await apiClient.get<VideoComment[]>(
    `/videos/${encodeURIComponent(videoId)}/comments`,
  );

  return response.data;
}

export async function createVideoComment(
  videoId: string,
  content: string,
): Promise<VideoComment> {
  const response = await apiClient.post<
    { comment: VideoComment },
    { data: { comment: VideoComment } }
  >(`/videos/${encodeURIComponent(videoId)}/comments`, {
    content,
  });

  return response.data.comment;
}
