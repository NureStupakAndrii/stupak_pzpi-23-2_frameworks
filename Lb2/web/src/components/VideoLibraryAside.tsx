import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { getVideoStreamUrl } from "../api/videos";
import type { VideoSummary } from "../types";

interface VideoLibraryAsideProps {
  currentVideoId: string;
  videos: VideoSummary[];
}

export function VideoLibraryAside({
  currentVideoId,
  videos,
}: VideoLibraryAsideProps): ReactElement {
  return (
    <aside className="rounded-[1.75rem] border-4 border-accent bg-paper-soft p-5 shadow-pop">
      <div className="mt-2 flex items-center justify-between gap-3">
        <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-accent">
          More videos
        </h3>
        <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-paper">
          {videos.length - 1}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {videos
          .filter((item) => item.id !== currentVideoId)
          .map((item) => (
            <Link
              key={item.id}
              to={`/videos/${item.id}`}
              className="grid grid-cols-2 overflow-hidden rounded-[1.25rem] border-2 border-accent bg-white transition hover:-translate-y-0.5"
            >
              <div className="aspect-video h-full bg-black">
                <video
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                  src={getVideoStreamUrl(item.id)}
                />
              </div>
              <div className="min-w-0 p-3">
                <p className="line-clamp-2 text-sm font-semibold uppercase tracking-[-0.03em] text-accent">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </aside>
  );
}
