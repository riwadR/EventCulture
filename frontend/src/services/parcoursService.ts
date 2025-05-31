// services/parcoursService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { ParcoursType, ParcoursLieuxType } from '../types/parcoursType';

export interface ParcoursFilters {
  nom?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ParcoursCreateData {
  nom: string;
  description?: string;
}

export interface ParcoursUpdateData {
  nom?: string;
  description?: string;
}

export interface ParcoursLieuxCreateData {
  id_parcours: number;
  id_lieu: number;
  id_evenement?: number;
  ordre?: number;
}

export interface ParcoursLieuxUpdateData {
  ordre?: number;
  id_evenement?: number;
}

export class ParcoursService {
  private static instance: ParcoursService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): ParcoursService {
    if (!ParcoursService.instance) {
      ParcoursService.instance = new ParcoursService();
    }
    return ParcoursService.instance;
  }

  // ===============================
  // CRUD PARCOURS
  // ===============================

  // CREATE - Créer un parcours
  async createParcours(data: ParcoursCreateData): Promise<ApiResponse<ParcoursType>> {
    const validationError = this.validateParcoursData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<ParcoursType>('/parcours', data);
  }

  // READ - Récupérer tous les parcours avec filtres
  async getAllParcours(filters?: ParcoursFilters): Promise<ApiResponse<PaginatedResponse<ParcoursType>>> {
    return this.apiService.get<PaginatedResponse<ParcoursType>>('/parcours', filters);
  }

  // READ - Récupérer un parcours par ID
  async getParcoursById(id: number): Promise<ApiResponse<ParcoursType>> {
    return this.apiService.get<ParcoursType>(`/parcours/${id}`);
  }

  // UPDATE - Mettre à jour un parcours
  async updateParcours(id: number, data: ParcoursUpdateData): Promise<ApiResponse<ParcoursType>> {
    const validationError = this.validateParcoursUpdateData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<ParcoursType>(`/parcours/${id}`, data);
  }

  // DELETE - Supprimer un parcours
  async deleteParcours(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/parcours/${id}`);
  }

  // ===============================
  // GESTION DES LIEUX DU PARCOURS
  // ===============================

  // CREATE - Ajouter un lieu au parcours
  async addLieuToParcours(data: ParcoursLieuxCreateData): Promise<ApiResponse<ParcoursLieuxType>> {
    return this.apiService.post<ParcoursLieuxType>('/parcours-lieux', data);
  }

  // READ - Récupérer les lieux d'un parcours
  async getParcoursLieux(parcoursId: number): Promise<ApiResponse<ParcoursLieuxType[]>> {
    return this.apiService.get<ParcoursLieuxType[]>(`/parcours/${parcoursId}/lieux`);
  }

  // UPDATE - Mettre à jour un lieu du parcours
  async updateParcoursLieux(id: number, data: ParcoursLieuxUpdateData): Promise<ApiResponse<ParcoursLieuxType>> {
    return this.apiService.put<ParcoursLieuxType>(`/parcours-lieux/${id}`, data);
  }

  // UPDATE - Réorganiser l'ordre des lieux
  async reorderParcoursLieux(parcoursId: number, lieuxData: { id: number; ordre: number }[]): Promise<ApiResponse<void>> {
    return this.apiService.put<void>(`/parcours/${parcoursId}/lieux/reorder`, { 
      lieux: lieuxData 
    });
  }

  // DELETE - Supprimer un lieu du parcours
  async removeParcoursLieux(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/parcours-lieux/${id}`);
  }

  // SEARCH - Rechercher des parcours
  async searchParcours(query: string, filters?: Omit<ParcoursFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<ParcoursType>>> {
    return this.apiService.get<PaginatedResponse<ParcoursType>>('/parcours/search', { 
      search: query, 
      ...filters 
    });
  }

  // VALIDATION
  private validateParcoursData(data: ParcoursCreateData): string | null {
    if (!data.nom?.trim()) return 'Le nom du parcours est requis';
    return null;
  }

  private validateParcoursUpdateData(data: ParcoursUpdateData): string | null {
    if (data.nom !== undefined && !data.nom.trim()) {
      return 'Le nom du parcours ne peut pas être vide';
    }
    return null;
  }
}