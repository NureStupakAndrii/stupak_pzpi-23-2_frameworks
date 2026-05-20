import { createContext, useContext } from "react";
import type { AppUser, AuthMode } from "../types";

export interface AuthContextValue {
  currentUser: AppUser | null | undefined;
  openAuthDialog: (mode: AuthMode) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const authContext = useContext(AuthContext);

  if (authContext === null) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return authContext;
}
