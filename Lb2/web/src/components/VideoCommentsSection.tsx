import { type FormEvent, type ReactElement, useEffect, useState } from "react";
import { createVideoComment, fetchVideoComments } from "../api/videos";
import type { VideoComment } from "../types";
import { useAuth } from "./auth-context";

interface VideoCommentsSectionProps {
  videoId: string;
}

export function VideoCommentsSection({
  videoId,
}: VideoCommentsSectionProps): ReactElement {
  const { currentUser, openAuthDialog } = useAuth();
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadComments = async (): Promise<void> => {
      setLoading(true);

      try {
        const items = await fetchVideoComments(videoId);

        if (!isMounted) {
          return;
        }

        setComments(items);
        setErrorMessage("");
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load comments",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadComments();

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const content = String(formData.get("content") ?? "").trim();

    try {
      setSubmitting(true);
      setErrorMessage("");

      const comment = await createVideoComment(videoId, content);

      setComments((items) => [...items, comment]);
      formElement.reset();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to add comment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border-4 border-accent bg-paper-soft p-5 shadow-pop">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">
            Comments
          </p>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-accent">
            Discussion
          </h3>
        </div>
        <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-paper">
          {comments.length}
        </span>
      </div>

      {currentUser == null ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-accent/75">
            Log in to leave a comment.
          </p>
          <button
            type="button"
            onClick={() => openAuthDialog("login")}
            className="button-primary cursor-pointer"
          >
            Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <textarea
            name="content"
            rows={3}
            placeholder="Write a comment"
            required
            className="w-full resize-none rounded-2xl border-2 border-accent bg-paper px-4 py-3 text-sm font-medium text-accent placeholder:text-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="button-primary cursor-pointer px-6 py-3 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {loading && (
        <p className="mt-4 text-sm font-bold text-accent/70">
          Loading comments...
        </p>
      )}
      {errorMessage.length > 0 && (
        <p className="mt-4 rounded-[1.25rem] border-2 border-red-700 bg-red-50 p-4 text-sm font-medium text-red-900">
          {errorMessage}
        </p>
      )}
      {!loading && errorMessage.length === 0 && comments.length === 0 && (
        <p className="mt-4 text-sm font-medium text-accent/70">
          No comments yet.
        </p>
      )}
      {comments.length > 0 && (
        <div className="mt-5 grid gap-3">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-[1.25rem] border-2 border-accent bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black uppercase tracking-[-0.03em] text-accent">
                  {comment.username}
                </p>
                <time className="text-[11px] font-black uppercase tracking-[0.18em] text-accent/50">
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-accent/80">
                {comment.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
