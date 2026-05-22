import {
  type FormEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { loginUser, registerUser } from "../api/users";
import type { AppUser, AuthMode } from "../types";

export interface AuthDialogProps {
  mode: AuthMode | null;
  onClose: () => void;
  onAuthenticated: (user: AppUser) => void;
  onModeChange: (mode: AuthMode | null) => void;
}

export function AuthDialog({
  mode,
  onAuthenticated,
  onClose,
  onModeChange,
}: AuthDialogProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (dialogElement === null) {
      return;
    }

    if (mode !== null) {
      if (!dialogElement.open) {
        dialogElement.showModal();
      }

      return;
    }

    if (dialogElement.open) {
      dialogElement.close();
    }
  }, [mode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === null) {
      throw new Error("Auth dialog submitted while closed.");
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      setSubmitting(true);
      setErrorMessage("");

      const user = mode === "login" ? await loginUser(email, password) : await registerUser(email, username, password);

      onAuthenticated(user);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to authenticate",
      );
    } finally {
      setSubmitting(false);
      event.currentTarget.reset();
    }
  };

  const activeMode = mode ?? "login";

  const handleClose = (): void => {
    setErrorMessage("");
    setSubmitting(false);

    onClose();
  };

  const handleModeChange = (nextMode: AuthMode): void => {
    setErrorMessage("");
    onModeChange(nextMode);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="auth-dialog page-panel w-[min(100%-2rem,34rem)] p-0 text-ink backdrop:bg-accent/45"
    >
      <form method="dialog" className="flex justify-end p-4 pb-0">
        <button
          type="submit"
          className="rounded-full border-2 border-accent bg-paper px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-accent transition hover:bg-paper-soft"
        >
          Close
        </button>
      </form>

      <div className="px-5 pb-5 pt-2 sm:px-6 sm:pb-6">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">
          User access
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.06em] text-accent">
          {activeMode === "login" ? "Log in" : "Register"}
        </h2>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => handleModeChange("login")}
            className={
              activeMode === "login"
                ? "button-primary cursor-pointer"
                : "button-secondary cursor-pointer"
            }
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("register")}
            className={
              activeMode === "register"
                ? "button-primary cursor-pointer"
                : "button-secondary cursor-pointer"
            }
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-accent">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded-2xl border-2 border-accent bg-paper-soft px-4 py-3 text-sm font-medium text-accent placeholder:text-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
          </label>

          {activeMode === "register" && (
            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-accent">
                Username
              </span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="rounded-2xl border-2 border-accent bg-paper-soft px-4 py-3 text-sm font-medium text-accent placeholder:text-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10"
              />
            </label>
          )}

          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-accent">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete={
                activeMode === "login" ? "current-password" : "new-password"
              }
              required
              className="rounded-2xl border-2 border-accent bg-paper-soft px-4 py-3 text-sm font-medium text-accent placeholder:text-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
          </label>

          {errorMessage.length > 0 && (
            <div className="rounded-[1.25rem] border-2 border-red-700 bg-red-50 p-4 text-sm font-medium text-red-900">
              {errorMessage}
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="button-primary cursor-pointer px-8 py-3 text-[11px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? activeMode === "login"
                  ? "Logging in..."
                  : "Registering..."
                : activeMode === "login"
                  ? "Login"
                  : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
