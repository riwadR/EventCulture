// services/organisationService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { OrganisationType, TypeOrganisationEnum } from '../types/organisationType';
import { UserType } from '../types/userType';

export interface OrganisationFilters {
  nom?: string;
  type_organisation?: TypeOrganisationEnum;
  ville?: string;
  pays?: string;
  actif?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface OrganisationCreateData {
  nom: string;
  type_organisation: TypeOrganisationEnum;
  description?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  logo_url?: string;
}

export interface OrganisationUpdateData {
  nom?: string;
  type_organisation?: TypeOrganisationEnum;
  description?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  logo_url?: string;
  actif?: boolean;
}

export interface OrganisationStats {
  totalOrganisations: number;
  organisationsByType: Record<TypeOrganisationEnum, number>;
  organisationsByCity: Record<string, number>;
  activeOrganisations: number;
  recentOrganisations: OrganisationType[];
  topOrganisationsByEvents: OrganisationType[];
  topOrganisationsByMembers: OrganisationType[];
}

export class OrganisationService {
  private static instance: OrganisationService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): OrganisationService {
    if (!OrganisationService.instance) {
      OrganisationService.instance = new OrganisationService();
    }
    return OrganisationService.instance;
  }

  // CREATE - Créer une organisation
  async createOrganisation(data: OrganisationCreateData): Promise<ApiResponse<OrganisationType>> {
    const validationError = this.validateOrganisationData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<OrganisationType>('/organisations', data);
  }

  // READ - Récupérer toutes les organisations avec filtres
  async getAllOrganisations(filters?: OrganisationFilters): Promise<ApiResponse<PaginatedResponse<OrganisationType>>> {
    return this.apiService.get<PaginatedResponse<OrganisationType>>('/organisations', filters);
  }

  // READ - Récupérer une organisation par ID
  async getOrganisationById(id: number): Promise<ApiResponse<OrganisationType>> {
    return this.apiService.get<OrganisationType>(`/organisations/${id}`);
  }

  // READ - Récupérer les organisations actives
  async getActiveOrganisations(filters?: Omit<OrganisationFilters, 'actif'>): Promise<ApiResponse<PaginatedResponse<OrganisationType>>> {
    return this.apiService.get<PaginatedResponse<OrganisationType>>('/organisations/active', filters);
  }

  // READ - Récupérer les organisations par type
  async getOrganisationsByType(type: TypeOrganisationEnum, filters?: Omit<OrganisationFilters, 'type_organisation'>): Promise<ApiResponse<PaginatedResponse<OrganisationType>>> {
    return this.apiService.get<PaginatedResponse<OrganisationType>>(`/organisations/type/${type}`, filters);
  }

  // READ - Récupérer les organisations d'une ville
  async getOrganisationsByCity(ville: string, filters?: Omit<OrganisationFilters, 'ville'>): Promise<ApiResponse<PaginatedResponse<OrganisationType>>> {
    return this.apiService.get<PaginatedResponse<OrganisationType>>(`/organisations/city/${ville}`, filters);
  }

  // READ - Récupérer les membres d'une organisation
  async getOrganisationMembers(organisationId: number): Promise<ApiResponse<UserType[]>> {
    return this.apiService.get<UserType[]>(`/organisations/${organisationId}/members`);
  }

  // READ - Récupérer les événements d'une organisation
  async getOrganisationEvents(organisationId: number, filters?: any): Promise<ApiResponse<any>> {
    return this.apiService.get(`/organisations/${organisationId}/events`, filters);
  }

  // UPDATE - Mettre à jour une organisation
  async updateOrganisation(id: number, data: OrganisationUpdateData): Promise<ApiResponse<OrganisationType>> {
    const validationError = this.validateOrganisationUpdateData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<OrganisationType>(`/organisations/${id}`, data);
  }

  // UPDATE - Ajouter un membre à une organisation
  async addMember(organisationId: number, userId: number, role?: string): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/organisations/${organisationId}/members`, {
      userId,
      role
    });
  }

  // UPDATE - Retirer un membre d'une organisation
  async removeMember(organisationId: number, userId: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/organisations/${organisationId}/members/${userId}`);
  }

  // UPDATE - Changer le rôle d'un membre
  async updateMemberRole(organisationId: number, userId: number, role: string): Promise<ApiResponse<void>> {
    return this.apiService.patch<void>(`/organisations/${organisationId}/members/${userId}`, {
      role
    });
  }

  // UPDATE - Activer/désactiver une organisation
  async toggleOrganisationStatus(id: number, actif: boolean): Promise<ApiResponse<OrganisationType>> {
    return this.apiService.patch<OrganisationType>(`/organisations/${id}/status`, { actif });
  }

  // DELETE - Supprimer une organisation
  async deleteOrganisation(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/organisations/${id}`);
  }

  // UPLOAD - Télécharger un logo d'organisation
  async uploadOrganisationLogo(organisationId: number, file: File): Promise<ApiResponse<{ logo_url: string }>> {
    const validationError = this.validateImageFile(file);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.upload<{ logo_url: string }>(`/organisations/${organisationId}/logo`, file);
  }

  // SEARCH - Rechercher des organisations
  async searchOrganisations(query: string, filters?: Omit<OrganisationFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<OrganisationType>>> {
    return this.apiService.get<PaginatedResponse<OrganisationType>>('/organisations/search', { 
      search: query, 
      ...filters 
    });
  }

  // STATS - Récupérer les statistiques des organisations
  async getOrganisationStats(): Promise<ApiResponse<OrganisationStats>> {
    return this.apiService.get<OrganisationStats>('/organisations/stats');
  }

  // HELPER - Vérifier si un utilisateur peut modifier une organisation
  async canEditOrganisation(organisationId: number): Promise<ApiResponse<{ canEdit: boolean; reason?: string }>> {
    return this.apiService.get<{ canEdit: boolean; reason?: string }>(`/organisations/${organisationId}/can-edit`);
  }

  // HELPER - Vérifier si un utilisateur peut rejoindre une organisation
  async canJoinOrganisation(organisationId: number): Promise<ApiResponse<{ canJoin: boolean; reason?: string }>> {
    return this.apiService.get<{ canJoin: boolean; reason?: string }>(`/organisations/${organisationId}/can-join`);
  }

  // HELPER - Obtenir les types d'organisations disponibles
  getOrganisationTypes(): TypeOrganisationEnum[] {
    return Object.values(TypeOrganisationEnum);
  }

  // HELPER - Demander à rejoindre une organisation
  async requestToJoin(organisationId: number, message?: string): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/organisations/${organisationId}/join-request`, {
      message
    });
  }

  // HELPER - Approuver une demande d'adhésion
  async approveJoinRequest(organisationId: number, userId: number): Promise<ApiResponse<void>> {
    return this.apiService.patch<void>(`/organisations/${organisationId}/join-requests/${userId}/approve`, {});
  }

  // HELPER - Rejeter une demande d'adhésion
  async rejectJoinRequest(organisationId: number, userId: number, reason?: string): Promise<ApiResponse<void>> {
    return this.apiService.patch<void>(`/organisations/${organisationId}/join-requests/${userId}/reject`, {
      reason
    });
  }

  // HELPER - Récupérer les demandes d'adhésion en attente
  async getPendingJoinRequests(organisationId: number): Promise<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`/organisations/${organisationId}/join-requests/pending`);
  }

  // VALIDATION - Valider les données d'organisation
  private validateOrganisationData(data: OrganisationCreateData): string | null {
    if (!data.nom?.trim()) return 'Le nom de l\'organisation est requis';
    if (!data.type_organisation) return 'Le type d\'organisation est requis';

    if (data.email && !this.isValidEmail(data.email)) {
      return 'Email invalide';
    }

    if (data.site_web && !this.isValidUrl(data.site_web)) {
      return 'URL du site web invalide';
    }

    return null;
  }

  // VALIDATION - Valider les données de mise à jour d'organisation
  private validateOrganisationUpdateData(data: OrganisationUpdateData): string | null {
    if (data.nom !== undefined && !data.nom.trim()) {
      return 'Le nom de l\'organisation ne peut pas être vide';
    }

    if (data.email && !this.isValidEmail(data.email)) {
      return 'Email invalide';
    }

    if (data.site_web && !this.isValidUrl(data.site_web)) {
      return 'URL du site web invalide';
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

  // VALIDATION - Valider une URL
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}