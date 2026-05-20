import {
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { fetchCurrentUser, logoutUser } from "../api/users";
import type { AppUser, AuthMode } from "../types";
import { AuthDialog } from "./AuthDialog";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [currentUser, setCurrentUser] = useState<AppUser | null | undefined>(
    undefined,
  );
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async (): Promise<void> => {
      try {
        const user = await fetchCurrentUser();

        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error: unknown) {
        console.warn("Unable to load current user.", { error });

        if (isMounted) {
          setCurrentUser(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthDialog = (mode: AuthMode): void => {
    setAuthMode(mode);
  };

  const closeAuthDialog = (): void => {
    setAuthMode(null);
  };

  const handleAuthenticated = (user: AppUser): void => {
    setCurrentUser(user);
    setAuthMode(null);
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        openAuthDialog,
        logout,
      }}
    >
      {children}
      <AuthDialog
        mode={authMode}
        onAuthenticated={handleAuthenticated}
        onClose={closeAuthDialog}
        onModeChange={setAuthMode}
      />
    </AuthContext.Provider>
  );
}
