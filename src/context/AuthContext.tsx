import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { loginRequest } from "../api/auth.api";

interface AuthContextType {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken) setToken(savedToken);

      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        setUser(JSON.parse(savedUser));
      }

    } catch (err) {
      console.warn("Error leyendo localStorage", err);
      setUser(null);
      setToken(null);
    }

    setIsLoading(false);
  }, []);
    const login = async (email: string, password: string) => {
      const data = await loginRequest(email, password);

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
      }

      setUser(data.user);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      return data.user; 
    };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout }}
    >f
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
