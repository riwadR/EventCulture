// src/context/authContext.tsx

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserType, RoleEnum } from '../types/userType';
import { LoginCredentials, RegisterData } from '../services/authService';

export interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserType>) => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  hasPermission: (requiredRole: RoleEnum) => boolean;
  canCreateEvent: () => boolean;
  canCreateOeuvre: () => boolean;
  needsOrganisation: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Hook pour vérifier l'authentification avec redirection
export const useRequireAuth = (redirectTo?: string) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

// Hook pour vérifier les permissions avec redirection
export const useRequirePermission = (requiredRole: RoleEnum, redirectTo?: string) => {
  const { hasPermission, isLoading } = useAuthContext();
  const hasRequiredPermission = hasPermission(requiredRole);

  useEffect(() => {
    if (!isLoading && !hasRequiredPermission && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [hasRequiredPermission, isLoading, redirectTo]);

  return { hasPermission: hasRequiredPermission, isLoading };
};
