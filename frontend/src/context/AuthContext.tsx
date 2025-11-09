import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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

// Simple hardcoded admin credentials (no backend required)
const ADMIN_CREDENTIALS = {
  email: 'admin@portfolio.com',
  password: 'admin123'
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        console.log('🔐 Simple Auth: Checking credentials...');
        
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const adminUser: User = {
            id: '1',
            email: 'admin@portfolio.com',
            name: 'Shailendra Chaurasia',
            role: 'admin'
          };
          
          console.log('✅ Simple Auth: Login successful!');
          setUser(adminUser);
          localStorage.setItem('admin_user', JSON.stringify(adminUser));
          localStorage.setItem('auth_token', 'demo-token-123');
          setLoading(false);
          resolve();
        } else {
          console.log('❌ Simple Auth: Invalid credentials');
          setLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 500); // Simulate brief loading
    });
  };

  const logout = () => {
    console.log('🔓 Simple Auth: Logging out...');
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