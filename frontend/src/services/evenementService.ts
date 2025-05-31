// services/evenementService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { EvenementType, StatutParticipationEnum, EvenementUserType } from '../types/evenementType';

export interface EvenementFilters {
  nom_evenement?: string;
  type_evenement?: number;
  lieu_id?: number;
  organisation_id?: number;
  date_debut_from?: Date;
  date_debut_to?: Date;
  date_fin_from?: Date;
  date_fin_to?: Date;
  organisateur_id?: number;
  statut?: 'upcoming' | 'ongoing' | 'past';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface EvenementCreateData {
  nom_evenement: string;
  description?: string;
  date_debut?: Date;
  date_fin?: Date;
  contact_email?: string;
  contact_telephone?: string;
  image_url?: string;
  id_lieu: number;
  id_type_evenement: number;
  organisations: number[]; // IDs des organisations
  programmes?: ProgrammeCreateData[];
}

export interface EvenementUpdateData {
  nom_evenement?: string;
  description?: string;
  date_debut?: Date;
  date_fin?: Date;
  contact_email?: string;
  contact_telephone?: string;
  image_url?: string;
  id_lieu?: number;
  id_type_evenement?: number;
}

export interface ProgrammeCreateData {
  titre: string;
  description?: string;
  heure_debut?: Date;
  heure_fin?: Date;
  lieu_specifique?: string;
}

export interface ParticipationData {
  role_participation: string;
  notes?: string;
}

export interface EvenementStats {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  pastEvents: number;
  totalParticipants: number;
  eventsByType: Record<string, number>;
  eventsByMonth: Record<string, number>;
}

export class EvenementService {
  private static instance: EvenementService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): EvenementService {
    if (!EvenementService.instance) {
      EvenementService.instance = new EvenementService();
    }
    return EvenementService.instance;
  }

  // CREATE - Créer un événement
  async createEvenement(data: EvenementCreateData): Promise<ApiResponse<EvenementType>> {
    const validationError = this.validateEvenementData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<EvenementType>('/evenements', data);
  }

  // READ - Récupérer tous les événements avec filtres
  async getAllEvenements(filters?: EvenementFilters): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>('/evenements', filters);
  }

  // READ - Récupérer un événement par ID
  async getEvenementById(id: number): Promise<ApiResponse<EvenementType>> {
    return this.apiService.get<EvenementType>(`/evenements/${id}`);
  }

  // READ - Récupérer les événements d'un utilisateur
  async getEvenementsByUser(userId: number, filters?: Omit<EvenementFilters, 'organisateur_id'>): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>(`/users/${userId}/evenements`, filters);
  }

  // READ - Récupérer les événements d'une organisation
  async getEvenementsByOrganisation(organisationId: number, filters?: Omit<EvenementFilters, 'organisation_id'>): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>(`/organisations/${organisationId}/evenements`, filters);
  }

  // READ - Récupérer les événements d'un lieu
  async getEvenementsByLieu(lieuId: number, filters?: Omit<EvenementFilters, 'lieu_id'>): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>(`/lieux/${lieuId}/evenements`, filters);
  }

  // READ - Récupérer les événements à venir
  async getUpcomingEvenements(filters?: EvenementFilters): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>('/evenements/upcoming', filters);
  }

  // READ - Récupérer les événements en cours
  async getOngoingEvenements(filters?: EvenementFilters): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>('/evenements/ongoing', filters);
  }

  // READ - Récupérer les événements passés
  async getPastEvenements(filters?: EvenementFilters): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>('/evenements/past', filters);
  }

  // READ - Récupérer les participants d'un événement
  async getEvenementParticipants(evenementId: number): Promise<ApiResponse<EvenementUserType[]>> {
    return this.apiService.get<EvenementUserType[]>(`/evenements/${evenementId}/participants`);
  }

  // UPDATE - Mettre à jour un événement
  async updateEvenement(id: number, data: EvenementUpdateData): Promise<ApiResponse<EvenementType>> {
    const validationError = this.validateEvenementUpdateData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<EvenementType>(`/evenements/${id}`, data);
  }

  // UPDATE - S'inscrire à un événement
  async joinEvenement(evenementId: number, data: ParticipationData): Promise<ApiResponse<EvenementUserType>> {
    return this.apiService.post<EvenementUserType>(`/evenements/${evenementId}/join`, data);
  }

  // UPDATE - Se désinscrire d'un événement
  async leaveEvenement(evenementId: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/evenements/${evenementId}/leave`);
  }

  // UPDATE - Changer le statut de participation
  async updateParticipationStatus(evenementId: number, userId: number, status: StatutParticipationEnum): Promise<ApiResponse<EvenementUserType>> {
    return this.apiService.patch<EvenementUserType>(`/evenements/${evenementId}/participants/${userId}`, { 
      statut_participation: status 
    });
  }

  // UPDATE - Ajouter une œuvre à un événement
  async addOeuvreToEvenement(evenementId: number, oeuvreId: number, presentateurId?: number): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/evenements/${evenementId}/oeuvres`, {
      id_oeuvre: oeuvreId,
      id_presentateur: presentateurId
    });
  }

  // UPDATE - Retirer une œuvre d'un événement
  async removeOeuvreFromEvenement(evenementId: number, oeuvreId: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/evenements/${evenementId}/oeuvres/${oeuvreId}`);
  }

  // DELETE - Supprimer un événement
  async deleteEvenement(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/evenements/${id}`);
  }

  // UPLOAD - Télécharger une image d'événement
  async uploadEvenementImage(evenementId: number, file: File): Promise<ApiResponse<{ image_url: string }>> {
    const validationError = this.validateImageFile(file);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.upload<{ image_url: string }>(`/evenements/${evenementId}/image`, file);
  }

  // SEARCH - Rechercher des événements
  async searchEvenements(query: string, filters?: Omit<EvenementFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<EvenementType>>> {
    return this.apiService.get<PaginatedResponse<EvenementType>>('/evenements/search', { 
      search: query, 
      ...filters 
    });
  }

  // STATS - Récupérer les statistiques des événements
  async getEvenementStats(): Promise<ApiResponse<EvenementStats>> {
    return this.apiService.get<EvenementStats>('/evenements/stats');
  }

  // HELPER - Vérifier si un utilisateur peut modifier un événement
  async canEditEvenement(evenementId: number): Promise<ApiResponse<{ canEdit: boolean; reason?: string }>> {
    return this.apiService.get<{ canEdit: boolean; reason?: string }>(`/evenements/${evenementId}/can-edit`);
  }

  // HELPER - Vérifier si un utilisateur peut supprimer un événement
  async canDeleteEvenement(evenementId: number): Promise<ApiResponse<{ canDelete: boolean; reason?: string }>> {
    return this.apiService.get<{ canDelete: boolean; reason?: string }>(`/evenements/${evenementId}/can-delete`);
  }

  // HELPER - Vérifier si un utilisateur peut rejoindre un événement
  async canJoinEvenement(evenementId: number): Promise<ApiResponse<{ canJoin: boolean; reason?: string }>> {
    return this.apiService.get<{ canJoin: boolean; reason?: string }>(`/evenements/${evenementId}/can-join`);
  }

  // HELPER - Obtenir les événements recommandés pour un utilisateur
  async getRecommendedEvenements(limit: number = 10): Promise<ApiResponse<EvenementType[]>> {
    return this.apiService.get<EvenementType[]>('/evenements/recommended', { limit });
  }

  // VALIDATION - Valider les données d'événement
  private validateEvenementData(data: EvenementCreateData): string | null {
    if (!data.nom_evenement?.trim()) return 'Le nom de l\'événement est requis';
    if (!data.id_lieu) return 'Le lieu est requis';
    if (!data.id_type_evenement) return 'Le type d\'événement est requis';
    if (!data.organisations || data.organisations.length === 0) return 'Au moins une organisation est requise';

    if (data.date_debut && data.date_fin) {
      if (new Date(data.date_debut) >= new Date(data.date_fin)) {
        return 'La date de fin doit être postérieure à la date de début';
      }
    }

    if (data.contact_email && !this.isValidEmail(data.contact_email)) {
      return 'Email de contact invalide';
    }

    return null;
  }

  // VALIDATION - Valider les données de mise à jour d'événement
  private validateEvenementUpdateData(data: EvenementUpdateData): string | null {
    if (data.nom_evenement !== undefined && !data.nom_evenement.trim()) {
      return 'Le nom de l\'événement ne peut pas être vide';
    }

    if (data.date_debut && data.date_fin) {
      if (new Date(data.date_debut) >= new Date(data.date_fin)) {
        return 'La date de fin doit être postérieure à la date de début';
      }
    }

    if (data.contact_email && !this.isValidEmail(data.contact_email)) {
      return 'Email de contact invalide';
    }

    return null;
  }

  // VALIDATION - Valider un fichier image
  private validateImageFile(file: File): string | null {
    const maxSize = 10 * 1024 * 1024; // 10MB pour les images d'événements
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return 'La taille du fichier ne doit pas dépasser 10MB';
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