'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, AuthResponse, UserProfile } from '../lib/api-client';

interface User {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  subscribeToPlan: (planId: string) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'coastal_auth_token';
const USER_KEY = 'coastal_user';
const PROFILE_KEY = 'coastal_profile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const storedProfile = localStorage.getItem(PROFILE_KEY);

        if (storedUser && storedProfile) {
          setUser(JSON.parse(storedUser));
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        // Clear invalid data
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PROFILE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Request OTP code
   */
  const requestOtp = async (email: string) => {
    try {
      const response = await apiClient.requestOtp(email);
      
      if (response.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Failed to send OTP' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  };

  /**
   * Verify OTP and login
   */
  const login = async (email: string, otp: string) => {
    try {
      const response = await apiClient.verifyOtp(email, otp) as AuthResponse;
      
      if (response.success && response.data) {
        const userData = response.data.user;
        const profileData = response.data.profile;

        // Save to state
        setUser(userData);
        setProfile(profileData);

        // Save to localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
        localStorage.setItem(TOKEN_KEY, userData.access_token);

        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.message || 'Invalid OTP code' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      if (user?.access_token) {
        await apiClient.logout(user.access_token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and storage
      setUser(null);
      setProfile(null);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  /**
   * Refresh user profile data
   */
  const refreshProfile = async () => {
    if (!user?.access_token) return;

    try {
      const response = await apiClient.getUserProfile(user.access_token);
      
      if (response.success && response.data) {
        setProfile(response.data);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const subscribeToPlan = async (planId: string) => {
    if (!user?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!planId) {
      return { success: false, error: 'Plan ID is required' };
    }

    const response = await apiClient.createSubscription(user.access_token, planId);

    if (response.success) {
      if (response.data) {
        setProfile(response.data);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(response.data));
      } else {
        await refreshProfile();
      }
      return { success: true };
    }

    return {
      success: false,
      error: response.error || 'Failed to create subscription',
    };
  };

  const cancelSubscription = async () => {
    if (!user?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await apiClient.cancelSubscription(user.access_token);

    if (response.success) {
      if (response.data) {
        setProfile(response.data);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(response.data));
      } else {
        await refreshProfile();
      }
      return { success: true };
    }

    return {
      success: false,
      error: response.error || 'Failed to cancel subscription',
    };
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    requestOtp,
    refreshProfile,
    subscribeToPlan,
    cancelSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para sa auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;


