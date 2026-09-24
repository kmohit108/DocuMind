'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserSettings } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  settings: UserSettings;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Alex Developer',
  email: 'alex.developer@example.com',
  theme: 'dark',
  density: 'comfortable',
  emailNotifications: true,
  summaryAlerts: true,
  aiModel: 'Claude 3.5 Sonnet (DocuMind Optimized)',
  aiTemperature: 0.2,
  storageUsed: 10400000,
  storageLimit: 1000000000, // 1 GB demo limit
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        
        const storedSettings = localStorage.getItem('documind_user_settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedIn = await authService.login(email, password);
      setUser(loggedIn);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const newUser = await authService.signup(name, email, password);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      const demo = await authService.loginDemo();
      setUser(demo);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('documind_user_settings', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        settings,
        login,
        signup,
        loginDemo,
        logout,
        updateUser,
        updateSettings,
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
