import { type FormEvent, type ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/videos";
import { useAuth } from "../components/auth-context";
import { EditorialLayout } from "../components/EditorialLayout";
import { StateCard } from "../components/StateCard";

export function UploadPage(): ReactElement {
  const navigate = useNavigate();
  const { currentUser, openAuthDialog } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser !== null) {
      return;
    }

    openAuthDialog("login");
    navigate("/", { replace: true });
  }, [currentUser, navigate, openAuthDialog]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      setSubmitting(true);
      setErrorMessage("");

      await uploadVideo(formData);

      formElement.reset();
      navigate("/");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to upload video",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EditorialLayout
      activeSection="upload"
      title="Upload"
      subtitle="A dedicated place to prepare the next upload"
    >
      <section className="mx-auto w-full max-w-[1024px]">
        <div className="page-panel">
          <div className="p-4 sm:p-5">
            <article className="mx-auto max-w-4xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-accent">
                    Upload video
                  </p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-accent">
                    New Submission
                  </h2>
                </div>
              </div>

              {currentUser == null ? (
                <StateCard title="Checking session" />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="title"
                      className="text-lg font-black uppercase tracking-[0.24em] text-accent"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter video title"
                      className="w-full rounded-2xl border-2 border-accent bg-paper-soft px-4 py-3 text-md font-semibold text-accent placeholder:text-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-shadow"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="description"
                      className="text-lg font-black uppercase tracking-[0.24em] text-accent"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Describe the video content"
                      className="w-full resize-none rounded-2xl border-2 border-accent bg-paper-soft px-4 py-3 text-md font-semibold text-accent placeholder:text-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-shadow"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="video"
                      className="text-lg font-black uppercase tracking-[0.24em] text-accent"
                    >
                      Video File
                    </label>
                    <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-4 border-dashed border-accent bg-paper p-10 text-center transition-colors hover:bg-paper-soft">
                      <input
                        id="video"
                        name="video"
                        type="file"
                        accept="video/*"
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        required
                      />
                      <div className="pointer-events-none flex flex-col items-center">
                        <p className="text-lg font-black uppercase tracking-[0.3em] text-accent">
                          Select a file
                        </p>
                        <p className="mx-auto mt-3 max-w-xl text-md leading-7 text-accent/80">
                          Drag and drop your video here, or click anywhere in
                          this box to browse your files.
                        </p>
                      </div>
                    </div>
                  </div>

                  {errorMessage.length > 0 && (
                    <StatusMessage message={errorMessage} />
                  )}

                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full border-2 border-accent bg-accent px-8 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-all hover:bg-accent/90 cursor-pointer"
                    >
                      {submitting ? "Uploading..." : "Upload Video"}
                    </button>
                  </div>
                </form>
              )}
            </article>
          </div>
        </div>
      </section>
    </EditorialLayout>
  );
}

interface StatusMessageProps {
  message: string;
}

function StatusMessage({ message }: StatusMessageProps): ReactElement {
  return (
    <div className="rounded-[1.25rem] border-2 border-red-700 bg-red-50 p-4 text-sm font-medium text-red-900">
      {message}
    </div>
  );
}
