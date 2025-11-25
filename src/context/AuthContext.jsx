import { createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import verifyToken from "../api/auth/verifyToken";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {

  const { loading, setLoading, isLoggedIn, setIsLoggedIn } = useAppContext();


  const value = {
    loading,
    setLoading,
    isLoggedIn,
    setIsLoggedIn,
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      const data = await verifyToken();

      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

