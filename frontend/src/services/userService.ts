// services/userService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { UserType, UserTypeEnum, RoleEnum } from '../types/userType';

export interface UserFilters {
  type_user?: UserTypeEnum;
  role?: RoleEnum;
  search?: string;
  organisation_id?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UserUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  date_naissance?: Date;
  biographie?: string;
  photo_url?: string;
  type_user?: UserTypeEnum;
  role?: RoleEnum;
  id_organisation?: number;
}

export interface UserStats {
  totalUsers: number;
  usersByType: Record<UserTypeEnum, number>;
  usersByRole: Record<RoleEnum, number>;
  recentUsers: UserType[];
  activeUsers: number;
}

export class UserService {
  private static instance: UserService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // CREATE - Créer un utilisateur (admin seulement)
  async createUser(userData: Omit<UserType, 'id_user' | 'date_creation' | 'date_modification'>): Promise<ApiResponse<UserType>> {
    const validationError = this.validateUserData(userData);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<UserType>('/users', userData);
  }

  // READ - Récupérer tous les utilisateurs avec filtres
  async getAllUsers(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<UserType>>> {
    return this.apiService.get<PaginatedResponse<UserType>>('/users', filters);
  }

  // READ - Récupérer un utilisateur par ID
  async getUserById(id: number): Promise<ApiResponse<UserType>> {
    return this.apiService.get<UserType>(`/users/${id}`);
  }

  // READ - Récupérer un utilisateur par email
  async getUserByEmail(email: string): Promise<ApiResponse<UserType>> {
    return this.apiService.get<UserType>(`/users/email/${email}`);
  }

  // READ - Récupérer les utilisateurs d'une organisation
  async getUsersByOrganisation(organisationId: number, filters?: Omit<UserFilters, 'organisation_id'>): Promise<ApiResponse<PaginatedResponse<UserType>>> {
    return this.apiService.get<PaginatedResponse<UserType>>(`/organisations/${organisationId}/users`, filters);
  }

  // READ - Récupérer les professionnels en attente de validation
  async getPendingProfessionals(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<UserType>>> {
    return this.apiService.get<PaginatedResponse<UserType>>('/users/pending-professionals', filters);
  }

  // UPDATE - Mettre à jour un utilisateur
  async updateUser(id: number, userData: UserUpdateData): Promise<ApiResponse<UserType>> {
    const validationError = this.validateUserUpdateData(userData);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<UserType>(`/users/${id}`, userData);
  }

  // UPDATE - Mettre à jour son propre profil
  async updateProfile(userData: UserUpdateData): Promise<ApiResponse<UserType>> {
    const validationError = this.validateUserUpdateData(userData);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<UserType>('/users/profile', userData);
  }

  // UPDATE - Changer le rôle d'un utilisateur (admin seulement)
  async changeUserRole(id: number, role: RoleEnum): Promise<ApiResponse<UserType>> {
    return this.apiService.patch<UserType>(`/users/${id}/role`, { role });
  }

  // UPDATE - Valider un professionnel (admin seulement)
  async validateProfessional(id: number): Promise<ApiResponse<UserType>> {
    return this.apiService.patch<UserType>(`/users/${id}/validate`, {});
  }

  // UPDATE - Rejeter un professionnel (admin seulement)
  async rejectProfessional(id: number, reason: string): Promise<ApiResponse<UserType>> {
    return this.apiService.patch<UserType>(`/users/${id}/reject`, { reason });
  }

  // UPDATE - Activer/désactiver un utilisateur
  async toggleUserStatus(id: number, active: boolean): Promise<ApiResponse<UserType>> {
    return this.apiService.patch<UserType>(`/users/${id}/status`, { active });
  }

  // DELETE - Supprimer un utilisateur (soft delete)
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/users/${id}`);
  }

  // DELETE - Supprimer définitivement un utilisateur (admin seulement)
  async permanentDeleteUser(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/users/${id}/permanent`);
  }

  // UPLOAD - Télécharger une photo de profil
  async uploadProfilePhoto(file: File): Promise<ApiResponse<{ photo_url: string }>> {
    // Validation du fichier
    const validationError = this.validateImageFile(file);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.upload<{ photo_url: string }>('/users/profile/photo', file);
  }

  // SEARCH - Rechercher des utilisateurs
  async searchUsers(query: string, filters?: Omit<UserFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<UserType>>> {
    return this.apiService.get<PaginatedResponse<UserType>>('/users/search', { 
      search: query, 
      ...filters 
    });
  }

  // STATS - Récupérer les statistiques des utilisateurs (admin seulement)
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.apiService.get<UserStats>('/users/stats');
  }

  // VALIDATION - Vérifier si un email existe déjà
  async checkEmailExists(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    return this.apiService.get<{ exists: boolean }>(`/users/check-email/${email}`);
  }

  // VALIDATION - Vérifier si un utilisateur peut rejoindre une organisation
  async canJoinOrganisation(userId: number, organisationId: number): Promise<ApiResponse<{ canJoin: boolean; reason?: string }>> {
    return this.apiService.get<{ canJoin: boolean; reason?: string }>(`/users/${userId}/can-join-organisation/${organisationId}`);
  }

  // HELPER - Obtenir les types d'utilisateurs disponibles
  getUserTypes(): UserTypeEnum[] {
    return Object.values(UserTypeEnum);
  }

  // HELPER - Obtenir les rôles disponibles
  getUserRoles(): RoleEnum[] {
    return Object.values(RoleEnum);
  }

  // HELPER - Vérifier si un utilisateur peut créer des événements
  canCreateEvents(user: UserType): boolean {
    return user.type_user !== UserTypeEnum.VISITEUR;
  }

  // HELPER - Vérifier si un utilisateur peut créer des œuvres
  canCreateOeuvres(user: UserType): boolean {
    return user.type_user !== UserTypeEnum.VISITEUR;
  }

  // HELPER - Vérifier si un utilisateur a besoin d'une organisation
  needsOrganisation(user: UserType): boolean {
    return user.role === RoleEnum.PROFESSIONNEL;
  }

  // VALIDATION - Valider les données utilisateur
  private validateUserData(userData: Partial<UserType>): string | null {
    if (!userData.nom?.trim()) return 'Le nom est requis';
    if (!userData.prenom?.trim()) return 'Le prénom est requis';
    if (!userData.email?.trim()) return 'L\'email est requis';
    if (!this.isValidEmail(userData.email)) return 'Email invalide';
    if (!userData.type_user) return 'Le type d\'utilisateur est requis';
    if (!userData.role) return 'Le rôle est requis';

    // Vérification pour les professionnels
    if (userData.role === RoleEnum.PROFESSIONNEL && !userData.organisation?.id_organisation) {
      return 'Une organisation est requise pour les professionnels';
    }

    return null;
  }

  // VALIDATION - Valider les données de mise à jour
  private validateUserUpdateData(userData: UserUpdateData): string | null {
    if (userData.nom !== undefined && !userData.nom.trim()) return 'Le nom ne peut pas être vide';
    if (userData.prenom !== undefined && !userData.prenom.trim()) return 'Le prénom ne peut pas être vide';
    if (userData.email !== undefined) {
      if (!userData.email.trim()) return 'L\'email ne peut pas être vide';
      if (!this.isValidEmail(userData.email)) return 'Email invalide';
    }

    return null;
  }

  // VALIDATION - Valider un fichier image
  private validateImageFile(file: File): string | null {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return 'La taille du fichier ne doit pas dépasser 5MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Format de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP';
    }

    return null;
  }

  // VALIDATION - Valider un email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}