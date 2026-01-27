import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isGoogleAuthenticated, initializeGoogleAuth, loginWithGoogle } from '@/plugin/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userEmail: string | null;
  emailInput: string;
  setEmailInput: (email: string) => void;
  googleTokenReceived: boolean;
  login: () => Promise<void>;
  logout: () => void;
  confirmEmail: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string>('');
  const [googleTokenReceived, setGoogleTokenReceived] = useState(false);

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

    // Listen for storage changes (e.g., when logging in from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_email' || e.key === 'google_access_token') {
        console.log('📝 Storage change detected:', e.key);
        const email = localStorage.getItem('user_email');
        const token = localStorage.getItem('google_access_token');
        setUserEmail(email);
        setIsAuthenticated(!!token);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Starting login process...');
      const token = await loginWithGoogle();
      if (token) {
        setGoogleTokenReceived(true);
        // Give a moment for localStorage to be updated by the oauth callback
        await new Promise(resolve => setTimeout(resolve, 500));
        const email = localStorage.getItem('user_email');
        
        if (email) {
          setUserEmail(email);
          setIsAuthenticated(true);
          console.log('✓ Login successful for user:', email);
        } else {
          // Email not retrieved, wait for user input
          console.log('⚠ Google token received but email not available. Waiting for manual entry.');
          setError(null);
        }
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

  const confirmEmail = () => {
    const trimmedEmail = emailInput.trim();
    
    if (!trimmedEmail) {
      setError('Email is required to proceed');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    localStorage.setItem('user_email', trimmedEmail);
    setUserEmail(trimmedEmail);
    setIsAuthenticated(true);
    setEmailInput('');
    console.log('✓ Email confirmed:', trimmedEmail);
  };

  const logout = () => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUserEmail(null);
    setEmailInput('');
    setGoogleTokenReceived(false);
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
        emailInput,
        setEmailInput,
        googleTokenReceived,
        login,
        logout,
        confirmEmail,
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
