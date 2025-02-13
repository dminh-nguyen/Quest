import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const tokenFromStorage = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!tokenFromStorage);
  const [user, setUser] = useState<User | null>(null);

  // When the component mounts, if there's a token, decode it to get user details.
  useEffect(() => {
    if (tokenFromStorage) {
      try {
        const decoded: any = jwtDecode(tokenFromStorage);
        setUser({
          id: decoded.userId,
          name: decoded.name,
          roles: Array.isArray(decoded.roles)
            ? decoded.roles
            : [decoded.roles || "applicant"],
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [tokenFromStorage]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    try {
      const decoded: any = jwtDecode(token);
      setUser({
        id: decoded.userId,
        name: decoded.name,
        roles: Array.isArray(decoded.roles)
          ? decoded.roles
          : [decoded.roles || "applicant"],
      });
    } catch (error) {
      console.error("Failed to decode token during login", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/home";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
