import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { getVideoStreamUrl } from "../api/videos";
import { cn } from "../lib/cn";
import type { VideoSummary } from "../types";

interface VideoCardProps {
  video: VideoSummary;
}

export function VideoCard({ video }: VideoCardProps): ReactElement {
  return (
    <Link
      to={`/videos/${video.id}`}
      className={cn(
        "inner-panel",
        "group block overflow-hidden transition hover:-translate-y-1",
      )}
    >
      <div className="aspect-video overflow-hidden border-b-4 border-accent bg-black">
        <video
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          src={getVideoStreamUrl(video.id)}
        />
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-xl font-black uppercase tracking-[-0.04em] text-accent">
          {video.title}
        </h3>
        {video.sharedByUsername !== undefined && (
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-accent/60">
            Shared by {video.sharedByUsername}
          </p>
        )}
        {video.sharedByUsername === undefined && video.username != null && (
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-accent/60">
            Channel {video.username}
          </p>
        )}
      </div>
    </Link>
  );
}
