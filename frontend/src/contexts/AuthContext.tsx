'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { apiService, User, LoginRequest, RegisterRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  register: (userData: RegisterRequest) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear any invalid token
        apiService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Update user when wallet connects/disconnects
  useEffect(() => {
    if (isConnected && address && user) {
      // If user is already logged in, update their wallet address
      if (user.walletAddress !== address) {
        // Update user's wallet address without logging out
        setUser(prevUser => prevUser ? { ...prevUser, walletAddress: address } : null);
      }
    } else if (!isConnected && user) {
      // If wallet disconnects, keep user logged in but note the disconnection
      console.log('Wallet disconnected, but user remains logged in');
    }
  }, [isConnected, address, user]);

  const login = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Store user data directly (this is used for email/password login)
      setUser(userData as User);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const newUser = await apiService.register(userData);
      setUser(newUser);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setIsLoading(true);
    try {
      const updatedUser = await apiService.updateProfile(updates);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiService.logout();
  };

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
        register,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
