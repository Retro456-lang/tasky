import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ message: string; token?: string }>;
  resetPassword: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const token = authService.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      setUser(data);
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authService.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    try {
      const result = await authService.login(data);
      setUser(result.user);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const result = await authService.register(data);
      setUser(result.user);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearToken();
    setUser(null);
    // Redirect to login page manually if pathname is not an auth route
    const path = window.location.pathname;
    if (path !== '/signin' && path !== '/signup' && path !== '/forgot-password' && path !== '/reset-password') {
      window.history.pushState({}, '', '/signin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (data: any) => {
    await authService.resetPassword(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
