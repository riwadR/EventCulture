// hooks/useAuth.tsx - Version avec syntaxe JSX (renommer le fichier en .tsx)

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import type { 
  User, 
  Role, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  UpdateProfileData, 
  ChangePasswordData 
} from '../types/user';

// =============================================================================
// TYPES ET INTERFACES
// =============================================================================

export interface AuthTokenPayload {
  userId: number;
  email: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iat: number;
}

export interface PermissionCheck {
  resource: string;
  action: string;
  resourceId?: number;
  conditions?: Record<string, any>;
}

export interface AuthContextType {
  // État d'authentification
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions d'authentification
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  
  // Gestion des permissions
  hasPermission: (check: PermissionCheck) => boolean;
  hasAnyPermission: (checks: PermissionCheck[]) => boolean;
  hasAllPermissions: (checks: PermissionCheck[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  
  // Vérifications spécifiques
  canCreate: (resource: string) => boolean;
  canRead: (resource: string, resourceId?: number) => boolean;
  canUpdate: (resource: string, resourceId?: number) => boolean;
  canDelete: (resource: string, resourceId?: number) => boolean;
  canModerate: (resource?: string) => boolean;
  canAdminister: () => boolean;
  
  // Utilitaires
  isTokenValid: () => boolean;
  getTokenPayload: () => AuthTokenPayload | null;
  refreshToken: () => Promise<void>;
}

// =============================================================================
// CONSTANTES
// =============================================================================

export const PERMISSIONS = {
  OEUVRES_CREATE: 'oeuvres:create',
  OEUVRES_READ: 'oeuvres:read',
  OEUVRES_UPDATE: 'oeuvres:update',
  OEUVRES_DELETE: 'oeuvres:delete',
  OEUVRES_VALIDATE: 'oeuvres:validate',
  OEUVRES_MODERATE: 'oeuvres:moderate',
  
  EVENEMENTS_CREATE: 'evenements:create',
  EVENEMENTS_READ: 'evenements:read',
  EVENEMENTS_UPDATE: 'evenements:update',
  EVENEMENTS_DELETE: 'evenements:delete',
  EVENEMENTS_MANAGE_PARTICIPANTS: 'evenements:manage_participants',
  
  PATRIMOINE_CREATE: 'patrimoine:create',
  PATRIMOINE_READ: 'patrimoine:read',
  PATRIMOINE_UPDATE: 'patrimoine:update',
  PATRIMOINE_DELETE: 'patrimoine:delete',
  PATRIMOINE_VALIDATE: 'patrimoine:validate',
  
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_VALIDATE_PROFESSIONAL: 'users:validate_professional',
  USERS_MANAGE_ROLES: 'users:manage_roles',
  
  COMMENTS_CREATE: 'comments:create',
  COMMENTS_READ: 'comments:read',
  COMMENTS_UPDATE: 'comments:update',
  COMMENTS_DELETE: 'comments:delete',
  COMMENTS_MODERATE: 'comments:moderate',
  
  ADMIN_ACCESS: 'admin:access',
  ADMIN_ANALYTICS: 'admin:analytics',
  ADMIN_SYSTEM: 'admin:system',
  
  MODERATE_CONTENT: 'moderate:content',
  MODERATE_USERS: 'moderate:users',
  MODERATE_REPORTS: 'moderate:reports',
} as const;

export const ROLES = {
  ADMIN: 'Admin',
  PROFESSIONAL: 'Professionnel', 
  VISITOR: 'Visiteur',
} as const;

// =============================================================================
// SERVICES D'AUTHENTIFICATION
// =============================================================================

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur de connexion');
    }
    
    return response.json();
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur d\'inscription');
    }
    
    return response.json();
  },

  async getProfile(): Promise<User> {
    const token = tokenStorage.getToken();
    const response = await fetch('/api/auth/profile', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Erreur de récupération du profil');
    }
    
    const data = await response.json();
    return data.data;
  },

  async refreshToken(): Promise<string> {
    const token = tokenStorage.getToken();
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Impossible de rafraîchir le token');
    }
    
    const data = await response.json();
    return data.data.token;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const token = tokenStorage.getToken();
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur de mise à jour');
    }
    
    const result = await response.json();
    return result.data;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    const token = tokenStorage.getToken();
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur de changement de mot de passe');
    }
  }
};

// Utilitaires de gestion des tokens
const tokenStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('patrimoine_auth_token');
  },
  
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('patrimoine_auth_token', token);
  },
  
  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('patrimoine_auth_token');
  }
};

// =============================================================================
// CRÉATION DU CONTEXTE
// =============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
  }>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  // Décoder le payload du JWT
  const getTokenPayload = useCallback((): AuthTokenPayload | null => {
    const token = authState.token || tokenStorage.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }, [authState.token]);

  // Vérifier la validité du token
  const isTokenValid = useCallback((): boolean => {
    const payload = getTokenPayload();
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }, [getTokenPayload]);

  // Logout function
  const logout = useCallback(() => {
    tokenStorage.removeToken();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Rafraîchir le token automatiquement
  const refreshToken = useCallback(async () => {
    try {
      const newToken = await authService.refreshToken();
      tokenStorage.setToken(newToken);
      setAuthState(prev => ({ ...prev, token: newToken }));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      logout();
    }
  }, [logout]);

  // Vérification du statut d'authentification
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = tokenStorage.getToken();
      if (!token || !isTokenValid()) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const userProfile = await authService.getProfile();

      setAuthState({
        isAuthenticated: true,
        user: userProfile,
        token,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      tokenStorage.removeToken();
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    }
  }, [isTokenValid]);

  // =============================================================================
  // GESTION DES PERMISSIONS
  // =============================================================================

  const hasPermission = useCallback((check: PermissionCheck): boolean => {
    if (!authState.isAuthenticated || !authState.user?.Roles) return false;

    const requiredPermission = `${check.resource}:${check.action}`;
    
    return authState.user.Roles.some((role: Role) => 
      role.permissions.some((permission: string) => {
        return permission === requiredPermission;
      })
    );
  }, [authState.isAuthenticated, authState.user]);

  const hasAnyPermission = useCallback((checks: PermissionCheck[]): boolean => {
    return checks.some((check: PermissionCheck) => hasPermission(check));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((checks: PermissionCheck[]): boolean => {
    return checks.every((check: PermissionCheck) => hasPermission(check));
  }, [hasPermission]);

  const hasRole = useCallback((role: string): boolean => {
    if (!authState.isAuthenticated || !authState.user?.Roles) return false;
    return authState.user.Roles.some((r: Role) => r.nom_role.toLowerCase() === role.toLowerCase());
  }, [authState.isAuthenticated, authState.user]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return roles.some((role: string) => hasRole(role));
  }, [hasRole]);

  // =============================================================================
  // VÉRIFICATIONS SPÉCIFIQUES
  // =============================================================================

  const canCreate = useCallback((resource: string): boolean => {
    return hasPermission({ resource, action: 'create' });
  }, [hasPermission]);

  const canRead = useCallback((resource: string, resourceId?: number): boolean => {
    return hasPermission({ resource, action: 'read', resourceId });
  }, [hasPermission]);

  const canUpdate = useCallback((resource: string, resourceId?: number): boolean => {
    return hasPermission({ resource, action: 'update', resourceId });
  }, [hasPermission]);

  const canDelete = useCallback((resource: string, resourceId?: number): boolean => {
    return hasPermission({ resource, action: 'delete', resourceId });
  }, [hasPermission]);

  const canModerate = useCallback((resource?: string): boolean => {
    if (resource) {
      return hasPermission({ resource, action: 'moderate' });
    }
    return hasRole(ROLES.ADMIN);
  }, [hasPermission, hasRole]);

  const canAdminister = useCallback((): boolean => {
    return hasRole(ROLES.ADMIN);
  }, [hasRole]);

  // =============================================================================
  // ACTIONS D'AUTHENTIFICATION
  // =============================================================================

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.login(credentials);
      tokenStorage.setToken(response.token);

      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Erreur de connexion",
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.register(data);
      tokenStorage.setToken(response.token);

      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Erreur d'inscription",
      }));
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const updatedUser = await authService.updateProfile(data);

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Erreur de mise à jour du profil",
      }));
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      await authService.changePassword(data);

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Erreur de changement de mot de passe",
      }));
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const userProfile = await authService.getProfile();
      setAuthState(prev => ({
        ...prev,
        user: userProfile,
        error: null,
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || "Erreur de récupération du profil",
      }));
    }
  }, []);

  // =============================================================================
  // EFFETS
  // =============================================================================

  // Vérification initiale
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Surveillance de l'expiration du token
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      const payload = getTokenPayload();
      if (!payload) {
        logout();
        return;
      }

      // Rafraîchir le token 5 minutes avant expiration
      const timeUntilExpiry = payload.exp * 1000 - Date.now();
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        refreshToken();
      } else if (timeUntilExpiry <= 0) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, getTokenPayload, logout, refreshToken]);

  // =============================================================================
  // VALEUR DU CONTEXTE
  // =============================================================================

  const value: AuthContextType = {
    ...authState,
    
    // Actions d'authentification
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,
    checkAuthStatus,
    
    // Gestion des permissions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    
    // Vérifications spécifiques
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canModerate,
    canAdminister,
    
    // Utilitaires
    isTokenValid,
    getTokenPayload,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// HOOKS UTILITAIRES
// =============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook spécialisé pour les permissions
export function usePermissions() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canModerate,
    canAdminister,
    user,
    isAuthenticated
  } = useAuth();

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canModerate,
    canAdminister,
    user,
    isAuthenticated,
    
    // Permissions spécifiques métier
    canCreateOeuvre: () => canCreate('oeuvres'),
    canCreateEvenement: () => canCreate('evenements'),
    canCreatePatrimoine: () => canCreate('patrimoine'),
    canValidateContent: () => hasAnyPermission([
      { resource: 'oeuvres', action: 'validate' },
      { resource: 'patrimoine', action: 'validate' }
    ]),
    canManageUsers: () => hasPermission({ resource: 'users', action: 'manage' }),
    isProfessional: () => isAuthenticated && user?.type_user !== 'visiteur',
    isValidatedProfessional: () => isAuthenticated && user?.type_user !== 'visiteur' && user?.professionnel_valide === true,
    isAdmin: () => canAdminister(),
  };
}

// Hook pour la protection des routes avec permissions
export function useRequirePermission(check: PermissionCheck, redirectTo = "/") {
  const { hasPermission, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasPermission(check)) {
      window.location.href = redirectTo;
    }
  }, [hasPermission, check, isAuthenticated, isLoading, redirectTo]);

  return { hasPermission: hasPermission(check), isLoading };
}

// Composant de protection avec permissions
interface RequirePermissionProps {
  check: PermissionCheck;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequirePermission({
  check,
  fallback,
  children
}: RequirePermissionProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!hasPermission(check)) {
    return fallback || (
      <div className="text-center py-12">
        <p className="text-red-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}