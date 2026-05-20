import { type FormEvent, type ReactElement, useState } from "react";
import { shareVideo } from "../api/videos";
import { useAuth } from "./auth-context";

interface VideoSharePanelProps {
  videoId: string;
}

export function VideoSharePanel({
  videoId,
}: VideoSharePanelProps): ReactElement {
  const { currentUser, openAuthDialog } = useAuth();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const username = String(formData.get("username") ?? "").trim();

    try {
      setSubmitting(true);
      setMessage("");

      await shareVideo(videoId, username);

      formElement.reset();
      setMessage(`Shared with ${username}`);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Unable to share video");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border-4 border-accent bg-paper-soft p-5 shadow-pop">
      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">
        Share video
      </p>
      {currentUser == null ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-accent/75">
            Log in to send this video to another user profile.
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
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="min-w-0 flex-1 rounded-2xl border-2 border-accent bg-paper px-4 py-3 text-sm font-medium text-accent placeholder:text-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
          <button
            type="submit"
            disabled={submitting}
            className="button-primary cursor-pointer px-6 py-3 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Sharing..." : "Share"}
          </button>
        </form>
      )}
      {message.length > 0 && (
        <p className="mt-3 text-sm font-bold text-accent/80">{message}</p>
      )}
    </div>
  );
}
