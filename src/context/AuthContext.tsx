import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { ReactNode } from "react";

type AuthContextType = {
  user: {
    id: number;
    username: string;
    email: string;
  } | null;

  token: string | null;
  login: (user: AuthContextType["user"], token: string) => void;
  logout: () => void;
  loading: boolean;
};

type DecodedToken = {
  exp: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (jwtToken: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(jwtToken);
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      // if expired or not found, clear storage
      logout();
    }

    setLoading(false);
  }, []);

  const login = (userData: AuthContextType["user"], jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
