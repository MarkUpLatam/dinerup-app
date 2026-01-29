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
  updateUser: (newUser: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Actualizar usuario desde cualquier parte
  const updateUser = (newUser: any) => {
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  // 🔹 Cargar sesión persistida
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken) {
        setToken(savedToken);
      }

      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.warn("Error leyendo localStorage", err);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // LOGIN
  // IMPORTANTE:
  // - No decide estados de negocio
  // - No atrapa ni transforma errores
  // - Propaga INCOMPLETE_REGISTRATION tal cual
  const login = async (email: string, password: string) => {
    try {
      const data = await loginRequest(email, password);
      
        if (data?.accessToken) {
          setToken(data.accessToken);
          localStorage.setItem("auth_token", data.accessToken);
        }

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      return data?.user;

    } catch (err) {

      throw err;
    }
  };

  // 🔓 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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

// Hook de consumo
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
