import { createContext, useContext, ReactNode, useEffect } from 'react';
import useAuth from '../hooks/useAuth.jsx'
import { useAppContext } from './AppContext.jsx';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const { setLoading } = useAppContext()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      // Check if we have a token (in HttpOnly cookie, automatically sent)
      const response = await fetch('/api/auth/verifty-token', {
        credentials: 'include' // Important for sending cookies
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser(result.data);
          setIsAuthenticated(true);

          // Store minimal safe data in sessionStorage
          sessionStorage.setItem('userProfile', JSON.stringify({
            id: result.data.id,
            name: result.data.name,
            role: result.data.role,
            schoolId: result.data.schoolId
          }));
        } else {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
