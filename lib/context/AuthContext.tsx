// lib/context/AuthContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      const expiry = localStorage.getItem("token_expiry");
      if (expiry && Date.now() > Number(expiry)) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        setLoading(false);
        setIsAuthenticated(false);
        router.push("/auth/login");
        return;
      }

      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        router.push("/workspace");
      } else {
        setUser(null);
        setIsAuthenticated(false);
        router.push("/auth/login");
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
