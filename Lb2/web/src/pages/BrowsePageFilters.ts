import type { VideoSummary } from "../types";

export function filterVideos(
  videos: ReadonlyArray<VideoSummary>,
  searchText: string,
): ReadonlyArray<VideoSummary> {
  const normalizedSearchText = searchText.trim().toLowerCase();

  if (normalizedSearchText.length === 0) {
    return videos;
  }

  return videos.filter((video) => {
    const searchableText = [
      video.title,
      video.filename,
      video.originalName,
      video.mimeType,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchText);
  });
}
