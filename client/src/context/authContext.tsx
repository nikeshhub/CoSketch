import { USER_SIGNIN_ENDPOINT } from "@/api/apiLinks";
import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";

// User interface

// FormData interface for login
interface User {
  id: number;
  name: string;
  email: string;
}

// AuthContext interface
interface AuthContextType {
  currentUser: User;

  login: (formData: User) => Promise<void>;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") || "")
      : null
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (value: User) => {
    const res = await axios.post(USER_SIGNIN_ENDPOINT, value, {
      withCredentials: true,
    });
    setCurrentUser(res.data.data);
    setAccessToken(res.data.accessToken);
  };

  const logout = async () => {
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser) || "null");
    if (accessToken !== null) {
      localStorage.setItem("accessToken", accessToken);
    }
  }, [currentUser, accessToken]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
