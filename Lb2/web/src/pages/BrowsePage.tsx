import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { EditorialLayout } from "../components/EditorialLayout";
import { StateCard } from "../components/StateCard";
import { StatPill } from "../components/StatPill";
import { VideoCard } from "../components/VideoCard";
import { fetchVideos } from "../api/videos";
import { VideoSearchBar } from "../components/VideoSearchBar";
import type { VideoSummary } from "../types";
import { filterVideos } from "./BrowsePageFilters";

export function BrowsePage(): ReactElement {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<ReadonlyArray<VideoSummary>>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadVideos = async (): Promise<void> => {
      setLoading(true);

      try {
        const items = await fetchVideos();

        if (!isMounted) {
          return;
        }

        setVideos(items);
        setErrorMessage("");
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load videos",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVideos = filterVideos(videos, searchText);

  return (
    <EditorialLayout
      activeSection="browse"
      title="Browse videos"
    >
      <section className="mx-auto w-full max-w-[1320px]">
        <div className="page-panel">
          <div className="space-y-6 p-4 sm:p-5">
            <div className="flex justify-between">
              <VideoSearchBar value={searchText} onChange={setSearchText} />

              <div className="">
                <StatPill label="Total" value={videos.length} />
              </div>
            </div>

            {loading && <StateCard title="Loading videos" />}
            {!loading && errorMessage.length > 0 && (
              <StateCard
                title="Could not load videos"
                description={errorMessage}
              />
            )}
            {!loading &&
              errorMessage.length === 0 &&
              filteredVideos.length === 0 && (
                <StateCard
                  title="No videos found"
                  description="Try a different search term or clear the filter."
                />
              )}
            {!loading &&
              errorMessage.length === 0 &&
              filteredVideos.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
          </div>
        </div>
      </section>
    </EditorialLayout>
  );
}
