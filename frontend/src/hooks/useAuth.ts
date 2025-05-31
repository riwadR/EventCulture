// hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { AuthService, LoginCredentials, RegisterData } from '../services/authService';
import { UserType, RoleEnum } from '../types/userType';

interface UseAuthReturn {
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

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authService = AuthService.getInstance();

  // Initialiser l'état de l'authentification
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            // Optionnellement, vérifier avec le serveur
            await refreshUser();
          }
        }
      } catch (err) {
        console. log.error('Erreur lors de l\'initialisation de l\'authentification:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Connexion
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.error || 'Erreur de connexion');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  // Inscription
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.error || 'Erreur d\'inscription');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  // Déconnexion
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, [authService]);

  // Rafraîchir les données utilisateur
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!authService.isAuthenticated()) return;
    
    try {
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        // Mettre à jour le stockage local
        localStorage.setItem('user_data', JSON.stringify(response.data));
      } else if (response.error) {
        // Token probablement expiré, déconnecter l'utilisateur
        await logout();
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des données utilisateur:', err);
    }
  }, [authService, logout]);

  // Mettre à jour le profil
  const updateProfile = useCallback((updates: Partial<UserType>): void => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  }, [user]);

  // Effacer l'erreur
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Vérifier les permissions
  const hasPermission = useCallback((requiredRole: RoleEnum): boolean => {
    return authService.hasPermission(requiredRole);
  }, [authService]);

  // Vérifier si l'utilisateur peut créer des événements
  const canCreateEvent = useCallback((): boolean => {
    return authService.canCreateEvent();
  }, [authService]);

  // Vérifier si l'utilisateur peut créer des œuvres
  const canCreateOeuvre = useCallback((): boolean => {
    return authService.canCreateOeuvre();
  }, [authService]);

  // Vérifier si l'utilisateur a besoin d'une organisation
  const needsOrganisation = useCallback((): boolean => {
    return authService.needsOrganisation();
  }, [authService]);

  return {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    refreshUser,
    hasPermission,
    canCreateEvent,
    canCreateOeuvre,
    needsOrganisation
  };
};