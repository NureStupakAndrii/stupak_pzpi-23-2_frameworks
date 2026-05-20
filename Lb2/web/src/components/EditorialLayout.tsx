import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/cn";
import { useAuth } from "./auth-context";

export interface EditorialLayoutProps {
  title?: string;
  subtitle?: string;
  activeSection?: "browse" | "profile" | "upload";
  children: ReactNode;
}

export function EditorialLayout({
  activeSection,
  children,
  subtitle,
  title,
}: EditorialLayoutProps): ReactElement {
  const { currentUser, logout, openAuthDialog } = useAuth();

  const handleLogoutClick = (): void => {
    void logout().catch((error: unknown) => {
      console.warn("Unable to log out.", { error });
    });
  };

  return (
    <main className="min-h-screen overflow-hidden text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-end gap-2">
            <span className="text-[1.95rem] font-black uppercase leading-none tracking-[-0.1em] text-ink">
              LB2
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-3">
            <NavLink to="/" active={activeSection === "browse"}>
              All videos
            </NavLink>
            <NavLink to="/upload" active={activeSection === "upload"}>
              Upload
            </NavLink>
            {currentUser == null ? (
              <>
                <button
                  type="button"
                  onClick={() => openAuthDialog("login")}
                  className="button-primary cursor-pointer"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <NavLink to="/profile" active={activeSection === "profile"}>
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="button-secondary cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        <section className="flex flex-1 flex-col items-center pt-10 sm:pt-14">
          {(title || subtitle) && (
            <div className="w-full text-center">
              <h1 className="text-balance text-[76px] font-black uppercase leading-[0.82] tracking-[-0.1em] text-accent drop-shadow-[0_4px_0_rgba(255,248,241,0.18)]">
                {title}
              </h1>
              <p className="mx-auto mt-4 max-w-4xl text-sm font-black uppercase tracking-[0.22em] text-accent/90 sm:text-base">
                {subtitle}
              </p>
            </div>
          )}

          <div className="w-full flex-1 pt-8 pb-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  children: ReactNode;
}

function NavLink({ active, children, to }: NavLinkProps): ReactElement {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-full border-2 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] transition",
        active
          ? "border-accent bg-paper text-accent shadow-pop"
          : "border-black/15 bg-white/20 text-ink hover:bg-white/35",
      )}
    >
      {children}
    </Link>
  );
}
