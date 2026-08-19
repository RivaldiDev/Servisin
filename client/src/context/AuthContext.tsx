import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, UserTier } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: { fullName: string; email: string; password: string; phoneNumber?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateTier: (tier: UserTier) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('fixgarasi_token') || localStorage.getItem('servisin_token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const activeToken = localStorage.getItem('fixgarasi_token') || localStorage.getItem('servisin_token');
      if (!activeToken) {
        setUser(null);
        return;
      }
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
      setUser(null);
      localStorage.removeItem('fixgarasi_token');
      localStorage.removeItem('servisin_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data.data;
        localStorage.setItem('fixgarasi_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Login gagal' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Terjadi kesalahan saat login';
      return { success: false, message };
    }
  };

  const register = async (data: { fullName: string; email: string; password: string; phoneNumber?: string }) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data.data;
        localStorage.setItem('fixgarasi_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Registrasi gagal' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Terjadi kesalahan saat registrasi';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('fixgarasi_token');
    localStorage.removeItem('servisin_token');
    setToken(null);
    setUser(null);
  };

  const updateTier = async (tier: UserTier) => {
    try {
      const res = await api.post('/auth/toggle-tier', { tier });
      if (res.data.success) {
        await refreshUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to change user tier:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
