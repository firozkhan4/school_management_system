import { useState, useEffect, useCallback } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    // Optional: Remove other user data
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  }, []);

  return {
    isLoggedIn,
    isLoading,
    login,
    logout
  };
};

export default useAuth;
