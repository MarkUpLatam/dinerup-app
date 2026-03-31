import {
  useState,
  useEffect,
  ReactNode,
} from "react";

import { AUTH_UNAUTHORIZED_EVENT } from "../api/auth/authEvents";
import { AuthContext } from "./auth-context";
import {
  AuthUser,
  clearStoredAuth,
  extractToken,
  readStoredToken,
  readStoredUser,
  storeAuthSession,
  storeAuthUser,
} from "../api/auth/authStorage";
import { loginRequest } from "../api/auth/auth.api";
import { resetUnauthorizedEventState } from "../api/auth/authEvents";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(token && user);

  const updateUser = (newUser: AuthUser) => {
    setUser(newUser);
    storeAuthUser(newUser);
  };

  useEffect(() => {
    try {
      const savedToken = readStoredToken();
      const savedUser = readStoredUser();

      if (!savedToken || !savedUser) {
        clearStoredAuth();
        setUser(null);
        setToken(null);
        return;
      }

      setToken(savedToken);
      setUser(savedUser);
    } catch {
      setUser(null);
      setToken(null);
      clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    const nextToken = extractToken(data);
    const nextUser = (data?.user as AuthUser | undefined) ?? null;

    if (!nextToken || !nextUser) {
      clearStoredAuth();
      setUser(null);
      setToken(null);
      throw new Error("La respuesta de autenticacion no contiene la sesion.");
    }

    storeAuthSession(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);

    return nextUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearStoredAuth();
    resetUnauthorizedEventState();
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
