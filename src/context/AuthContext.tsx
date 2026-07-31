import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch, ApiError } from '../lib/api';

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  target_role?: string;
  experience_level?: string;
  career_stage?: string;
  bio?: string;
  linkedin_url?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('crackit_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveSession = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('crackit_access_token', accessToken);
    localStorage.setItem('crackit_refresh_token', refreshToken);
    setToken(accessToken);
  };

  const clearSession = () => {
    localStorage.removeItem('crackit_access_token');
    localStorage.removeItem('crackit_refresh_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshSession = async (refreshToken: string): Promise<boolean> => {
    try {
      const data = await apiFetch<{ user: User; session: { access_token: string; refresh_token: string } }>(
        '/auth/refresh',
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }
      );
      if (data.session) {
        saveSession(data.session.access_token, data.session.refresh_token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const checkAuth = async () => {
    const storedAccessToken = localStorage.getItem('crackit_access_token');
    const storedRefreshToken = localStorage.getItem('crackit_refresh_token');

    if (!storedAccessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiFetch<{ user: User; profile: Profile | null }>('/auth/me');
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401 && storedRefreshToken) {
        // Attempt silent session refresh
        const refreshed = await refreshSession(storedRefreshToken);
        if (refreshed) {
          try {
            const data = await apiFetch<{ user: User; profile: Profile | null }>('/auth/me');
            setUser(data.user);
            setProfile(data.profile);
          } catch {
            clearSession();
          }
        } else {
          clearSession();
        }
      } else {
        clearSession();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{
      user: User;
      session: { access_token: string; refresh_token: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.session) {
      saveSession(data.session.access_token, data.session.refresh_token);
      setUser(data.user);
      // Fetch profile
      try {
        const meData = await apiFetch<{ user: User; profile: Profile | null }>('/auth/me');
        setProfile(meData.profile);
      } catch {
        setProfile(null);
      }
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    const data = await apiFetch<{
      user: User;
      session: { access_token: string; refresh_token: string } | null;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });

    if (data.session) {
      saveSession(data.session.access_token, data.session.refresh_token);
      setUser(data.user);
      try {
        const meData = await apiFetch<{ user: User; profile: Profile | null }>('/auth/me');
        setProfile(meData.profile);
      } catch {
        setProfile(null);
      }
    } else {
      // If email confirmation is required by Supabase config
      setUser(data.user);
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession();
    }
  };

  const resetPassword = async (email: string) => {
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
