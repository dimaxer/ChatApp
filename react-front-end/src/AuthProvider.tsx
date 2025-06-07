import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  isAuth: boolean | null;
  setIsAuth: (isAuth: boolean | null) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const login = (email: string, password: string) => {
    console.log("check login");
    // if true set Auth
    setUser(email);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    setUser,
    isAuth,
    setIsAuth,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };