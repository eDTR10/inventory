import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from '@/plugin/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userEmail: string | null;
  userName: string | null;
  userId: number | null;
  isNewUser: boolean;
  login: (googleCredential: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('🔍 Checking authentication status...');
        const token = localStorage.getItem('auth_token');
        const email = localStorage.getItem('user_email');
        const name = localStorage.getItem('user_name');
        const id = localStorage.getItem('user_id');
        
        if (token && email) {
          setIsAuthenticated(true);
          setUserEmail(email);
          setUserName(name);
          setUserId(id ? parseInt(id) : null);
          console.log('✓ User is authenticated:', email);
        } else {
          console.log('ℹ User is not authenticated');
        }
      } catch (err) {
        console.error('✗ Failed to check auth:', err);
        setError('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., when logging in from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_email') {
        console.log('📝 Storage change detected:', e.key);
        const token = localStorage.getItem('auth_token');
        const email = localStorage.getItem('user_email');
        const name = localStorage.getItem('user_name');
        const id = localStorage.getItem('user_id');
        
        setIsAuthenticated(!!token && !!email);
        setUserEmail(email);
        setUserName(name);
        setUserId(id ? parseInt(id) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (googleCredential: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Authenticating with backend...');
      
      // Send the Google credential to your Django backend
      const response = await axios.post('users/google-auth/', {
        token: googleCredential
      });

      const { token, user, created } = response.data;

      // Store authentication data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_name', `${user.first_name} ${user.last_name}`);
      localStorage.setItem('user_id', user.id.toString());
      localStorage.setItem('user_acc_lvl', user.acc_lvl.toString());

      // Update state
      setIsAuthenticated(true);
      setUserEmail(user.email);
      setUserName(`${user.first_name} ${user.last_name}`);
      setIsNewUser(created);

      console.log(`✓ ${created ? 'Account created and' : 'Login'} successful for:`, user.email);
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Failed to login with Google';
      console.error('✗ Login failed:', message);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Logging in with email...');
      
      // Login via token endpoint
      const response = await axios.post('token/login/', {
        email,
        password,
      });

      const auth_token = response.data.auth_token;

      

      // Get user details
      const userResponse = await axios.get('users/me/', {
        headers: {
          Authorization: `Token ${auth_token}`
        }
      });

      const user = userResponse.data;

      // Store authentication data
      localStorage.setItem('auth_token', auth_token);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_name', `${user.first_name} ${user.last_name}`);
      localStorage.setItem('user_id', user.id.toString());
    

      // Update state
      setIsAuthenticated(true);
      setUserEmail(user.email);
      setUserName(`${user.first_name} ${user.last_name}`);
      setUserId(user.id);
      setIsNewUser(false);

      console.log('✓ Email login successful for:', user.email);
    } catch (err: any) {
      const message = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || err.message 
        || 'Failed to login with email';
      console.error('✗ Email login failed:', message);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📝 Creating new account...');
      
      // Create user account via Djoser endpoint
      const signupResponse = await axios.post('auth/users/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        re_password: password, // Djoser requires password confirmation
      });

      console.log('✓ Account created successfully. Please check your email for activation link.');
      
      // Note: Djoser sends an activation email by default
      // User needs to activate their account before logging in
      return signupResponse.data;

    } catch (err: any) {
      const message = err.response?.data?.email?.[0] 
        || err.response?.data?.password?.[0]
        || err.response?.data?.detail
        || err.message 
        || 'Failed to create account';
      console.error('✗ Signup failed:', message);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_acc_lvl');
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    setUserId(null);
    setIsNewUser(false);
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
        userName,
        userId,
        isNewUser,
        login,
        loginWithEmail,
        signup,
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
