import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVideos, getVideoStreamUrl } from "../api/videos";
import { EditorialLayout } from "../components/EditorialLayout";
import { LinkButton } from "../components/LinkButton";
import { StateCard } from "../components/StateCard";
import { VideoCommentsSection } from "../components/VideoCommentsSection";
import { VideoLibraryAside } from "../components/VideoLibraryAside";
import { VideoSharePanel } from "../components/VideoSharePanel";
import type { VideoSummary } from "../types";

export function VideoPage(): ReactElement {
  const { videoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<VideoSummary | null>(null);
  const [library, setLibrary] = useState<VideoSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadVideo = async (): Promise<void> => {
      if (videoId === undefined) {
        setErrorMessage("Missing video id.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const items = await fetchVideos();

        if (!isMounted) {
          return;
        }

        const matchedVideo = items.find((item) => item.id === videoId) ?? null;

        setLibrary(items);
        setVideo(matchedVideo);

        if (matchedVideo === null) {
          setErrorMessage("The requested video could not be found.");
        } else {
          setErrorMessage("");
        }
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load video",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadVideo();

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  return (
    <EditorialLayout activeSection="browse">
      <section className="mx-auto w-full max-w-[1320px]">
        <div className="page-panel">
          <div className="space-y-6 p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/" variant="secondary">
                Back to library
              </LinkButton>
            </div>

            {loading && <StateCard title="Loading video" />}

            {!loading && errorMessage.length > 0 && (
              <StateCard title="Video unavailable" description={errorMessage} />
            )}

            {!loading && errorMessage.length === 0 && video !== null && (
              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(22rem,0.8fr)]">
                <article className="rounded-4xl">
                  <div className="rounded-3xl border-4 border-accent bg-paper-muted p-2 shadow-[0_10px_0_rgba(75,13,102,0.12)]">
                    <video
                      className="aspect-video w-full rounded-2xl bg-black"
                      controls
                      playsInline
                      src={getVideoStreamUrl(video.id)}
                    />
                  </div>

                  <div className="my-5 px-12 flex flex-col gap-4">
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-accent">
                      {video.title}
                    </h2>
                    <p className="mt-2 text-lg font-medium text-accent/75">
                      {video.description}
                    </p>
                    <div className="flex flex-col gap-8">
                      <VideoSharePanel videoId={video.id} />
                      <VideoCommentsSection videoId={video.id} />
                    </div>
                  </div>
                </article>

                <VideoLibraryAside currentVideoId={video.id} videos={library} />
              </section>
            )}
          </div>
        </div>
      </section>
    </EditorialLayout>
  );
}
