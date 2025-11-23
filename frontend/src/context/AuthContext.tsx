import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 AuthContext: Calling login API...');
      const response = await authService.login(email, password);
      console.log('✅ AuthContext: Login successful', response);

      // The response structure might vary, adapting to common patterns
      const token = response.token || response.data?.token;
      const userData = response.user || response.data?.user;

      if (token && userData) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
      } else {
        console.error('❌ AuthContext: Invalid response structure', response);
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ AuthContext: Login failed', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🔓 AuthContext: Logging out...');
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};