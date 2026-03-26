import { createContext } from "react";
import type { AuthUser } from "../api/authStorage";

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
  updateUser: (newUser: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
