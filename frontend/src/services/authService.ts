// services/authService.ts

import { ApiService, ApiResponse } from './apiService';
import { UserType, UserTypeEnum, RoleEnum } from '../types/userType';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
  type_user: UserTypeEnum;
  telephone?: string;
  date_naissance?: Date;
  biographie?: string;
  id_organisation?: number; // Obligatoire pour les professionnels
}

export interface AuthResponse {
  user: UserType;
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class AuthService {
  private static instance: AuthService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Connexion
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      this.apiService.setToken(response.data.token);
      // Stocker aussi les infos utilisateur en local
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Inscription
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    // Validation côté client
    const validationError = this.validateRegistrationData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    const response = await this.apiService.post<AuthResponse>('/auth/register', data);
    
    if (response.success && response.data) {
      this.apiService.setToken(response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Déconnexion
  async logout(): Promise<ApiResponse<void>> {
    const response = await this.apiService.post<void>('/auth/logout');
    
    // Nettoyer le stockage local même si la requête échoue
    this.apiService.removeToken();
    localStorage.removeItem('user_data');
    
    return response;
  }

  // Rafraîchir le token
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return {
        success: false,
        error: 'Token de rafraîchissement manquant'
      };
    }

    const response = await this.apiService.post<AuthResponse>('/auth/refresh', {
      refreshToken
    });

    if (response.success && response.data) {
      this.apiService.setToken(response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }

    return response;
  }

  // Récupérer l'utilisateur actuel
  async getCurrentUser(): Promise<ApiResponse<UserType>> {
    return this.apiService.get<UserType>('/auth/me');
  }

  // Mot de passe oublié
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    return this.apiService.post<void>('/auth/forgot-password', data);
  }

  // Réinitialiser le mot de passe
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
    const validationError = this.validateResetPasswordData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<void>('/auth/reset-password', data);
  }

  // Changer le mot de passe
  async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    const validationError = this.validateChangePasswordData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<void>('/auth/change-password', data);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = this.apiService.getToken();
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  }

  // Récupérer les données utilisateur du stockage local
  getStoredUser(): UserType | null {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // Vérifier les permissions
  hasPermission(requiredRole: RoleEnum): boolean {
    const user = this.getStoredUser();
    if (!user) return false;

    if (user.role === RoleEnum.ADMIN) return true;
    if (requiredRole === RoleEnum.PROFESSIONNEL && user.role === RoleEnum.PROFESSIONNEL) return true;
    if (requiredRole === RoleEnum.USER) return true;

    return false;
  }

  // Vérifier si l'utilisateur peut créer des événements
  canCreateEvent(): boolean {
    const user = this.getStoredUser();
    if (!user) return false;
    
    // Les visiteurs ne peuvent pas créer d'événements
    return user.type_user !== UserTypeEnum.VISITEUR;
  }

  // Vérifier si l'utilisateur peut créer des œuvres
  canCreateOeuvre(): boolean {
    const user = this.getStoredUser();
    if (!user) return false;
    
    // Les visiteurs ne peuvent pas créer d'œuvres
    return user.type_user !== UserTypeEnum.VISITEUR;
  }

  // Vérifier si l'utilisateur a besoin d'une organisation
  needsOrganisation(): boolean {
    const user = this.getStoredUser();
    if (!user) return false;
    
    // Les professionnels ont besoin d'une organisation pour créer des événements
    return user.role === RoleEnum.PROFESSIONNEL;
  }

  // Validation des données d'inscription
  private validateRegistrationData(data: RegisterData): string | null {
    if (!data.nom.trim()) return 'Le nom est requis';
    if (!data.prenom.trim()) return 'Le prénom est requis';
    if (!data.email.trim()) return 'L\'email est requis';
    if (!this.isValidEmail(data.email)) return 'Email invalide';
    if (!data.password) return 'Le mot de passe est requis';
    if (data.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (data.password !== data.confirmPassword) return 'Les mots de passe ne correspondent pas';
    
    // Vérification pour les professionnels
    if (data.type_user !== UserTypeEnum.VISITEUR && !data.id_organisation) {
      return 'Une organisation est requise pour les professionnels';
    }

    return null;
  }

  // Validation des données de réinitialisation de mot de passe
  private validateResetPasswordData(data: ResetPasswordData): string | null {
    if (!data.token) return 'Token de réinitialisation manquant';
    if (!data.password) return 'Le mot de passe est requis';
    if (data.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (data.password !== data.confirmPassword) return 'Les mots de passe ne correspondent pas';

    return null;
  }

  // Validation des données de changement de mot de passe
  private validateChangePasswordData(data: ChangePasswordData): string | null {
    if (!data.currentPassword) return 'Le mot de passe actuel est requis';
    if (!data.newPassword) return 'Le nouveau mot de passe est requis';
    if (data.newPassword.length < 8) return 'Le nouveau mot de passe doit contenir au moins 8 caractères';
    if (data.newPassword !== data.confirmPassword) return 'Les mots de passe ne correspondent pas';
    if (data.currentPassword === data.newPassword) return 'Le nouveau mot de passe doit être différent de l\'ancien';

    return null;
  }

  // Validation email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}