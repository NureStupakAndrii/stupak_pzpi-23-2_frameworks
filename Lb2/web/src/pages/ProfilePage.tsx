import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSharedVideos } from "../api/videos";
import { useAuth } from "../components/auth-context";
import { EditorialLayout } from "../components/EditorialLayout";
import { StateCard } from "../components/StateCard";
import { VideoCard } from "../components/VideoCard";
import type { VideoSummary } from "../types";

export function ProfilePage(): ReactElement {
  const { currentUser, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser !== null) {
      return;
    }

    openAuthDialog("login");
    navigate("/", { replace: true });
  }, [currentUser, navigate, openAuthDialog]);

  useEffect(() => {
    let isMounted = true;

    const loadSharedVideos = async (): Promise<void> => {
      if (currentUser == null) {
        setVideos([]);
        return;
      }

      setLoading(true);

      try {
        const items = await fetchSharedVideos();

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
          error instanceof Error
            ? error.message
            : "Unable to load shared videos",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSharedVideos();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <EditorialLayout
      activeSection="profile"
      title="Profile"
      subtitle="Videos shared with your account"
    >
      <section className="mx-auto w-full max-w-[1320px]">
        <div className="page-panel">
          <div className="space-y-6 p-4 sm:p-5">
            {currentUser == null ? (
              <StateCard title="Checking session" />
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">
                      Signed in as
                    </p>
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-accent">
                      {currentUser.username}
                    </h2>
                  </div>
                  <span className="rounded-full bg-accent px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-paper">
                    Shared {videos.length}
                  </span>
                </div>

                {loading && <StateCard title="Loading shared videos" />}
                {!loading && errorMessage.length > 0 && (
                  <StateCard
                    title="Could not load shared videos"
                    description={errorMessage}
                  />
                )}
                {!loading &&
                  errorMessage.length === 0 &&
                  videos.length === 0 && (
                    <StateCard
                      title="No shared videos"
                      description="Videos that other users share with you will appear here."
                    />
                  )}
                {!loading &&
                  errorMessage.length === 0 &&
                  videos.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </section>
    </EditorialLayout>
  );
}
