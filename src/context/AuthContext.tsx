import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isGoogleAuthenticated, initializeGoogleAuth, loginWithGoogle } from '@/plugin/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userEmail: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication status...');
        await initializeGoogleAuth();
        const authenticated = isGoogleAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          console.log('✓ User is authenticated');
          const email = localStorage.getItem('user_email');
          setUserEmail(email);
        } else {
          console.log('ℹ User is not authenticated');
          setUserEmail(null);
        }
      } catch (err) {
        console.error('✗ Failed to check auth:', err);
        setError('Failed to initialize Google API');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Starting login process...');
      const token = await loginWithGoogle();
      if (token) {
        setIsAuthenticated(true);
        const email = localStorage.getItem('user_email');
        setUserEmail(email);
        console.log('✓ Login successful');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      console.error('✗ Login failed:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUserEmail(null);
    setError(null);
    console.log('✓ User logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        userEmail,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
