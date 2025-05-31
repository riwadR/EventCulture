// services/tagService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { 
  TagMotCleType, 
  OeuvreTagType, 
  TagCreateData, 
  TagUpdateData, 
  TagFilters 
} from '../types/tagMotCleType';

export class TagService {
  private static instance: TagService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  // CREATE - Créer un tag
  async createTag(data: TagCreateData): Promise<ApiResponse<TagMotCleType>> {
    const validationError = this.validateTagData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<TagMotCleType>('/tags', data);
  }

  // READ - Récupérer tous les tags
  async getAllTags(filters?: TagFilters): Promise<ApiResponse<PaginatedResponse<TagMotCleType>>> {
    return this.apiService.get<PaginatedResponse<TagMotCleType>>('/tags', filters);
  }

  // READ - Récupérer un tag par ID
  async getTagById(id: number): Promise<ApiResponse<TagMotCleType>> {
    return this.apiService.get<TagMotCleType>(`/tags/${id}`);
  }

  // READ - Récupérer les tags d'une œuvre
  async getTagsByOeuvre(oeuvreId: number): Promise<ApiResponse<TagMotCleType[]>> {
    return this.apiService.get<TagMotCleType[]>(`/oeuvres/${oeuvreId}/tags`);
  }

  // READ - Récupérer les relations œuvre-tag
  async getOeuvreTags(oeuvreId?: number): Promise<ApiResponse<OeuvreTagType[]>> {
    const endpoint = oeuvreId ? `/oeuvres/${oeuvreId}/oeuvre-tags` : '/oeuvre-tags';
    return this.apiService.get<OeuvreTagType[]>(endpoint);
  }

  // READ - Rechercher des tags
  async searchTags(query: string, filters?: Omit<TagFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<TagMotCleType>>> {
    return this.apiService.get<PaginatedResponse<TagMotCleType>>('/tags/search', { 
      search: query, 
      ...filters 
    });
  }

  // READ - Récupérer les tags populaires
  async getPopularTags(limit: number = 10): Promise<ApiResponse<TagMotCleType[]>> {
    return this.apiService.get<TagMotCleType[]>('/tags/popular', { limit });
  }

  // UPDATE - Mettre à jour un tag
  async updateTag(id: number, data: TagUpdateData): Promise<ApiResponse<TagMotCleType>> {
    const validationError = this.validateTagUpdateData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<TagMotCleType>(`/tags/${id}`, data);
  }

  // UPDATE - Associer un tag à une œuvre
  async addTagToOeuvre(oeuvreId: number, tagId: number): Promise<ApiResponse<OeuvreTagType>> {
    return this.apiService.post<OeuvreTagType>(`/oeuvres/${oeuvreId}/tags/${tagId}`, {});
  }

  // UPDATE - Associer plusieurs tags à une œuvre
  async addTagsToOeuvre(oeuvreId: number, tagIds: number[]): Promise<ApiResponse<OeuvreTagType[]>> {
    return this.apiService.post<OeuvreTagType[]>(`/oeuvres/${oeuvreId}/tags`, { tag_ids: tagIds });
  }

  // DELETE - Supprimer un tag
  async deleteTag(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/tags/${id}`);
  }

  // DELETE - Retirer un tag d'une œuvre
  async removeTagFromOeuvre(oeuvreId: number, tagId: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/oeuvres/${oeuvreId}/tags/${tagId}`);
  }

  // DELETE - Retirer plusieurs tags d'une œuvre
  async removeTagsFromOeuvre(oeuvreId: number, tagIds: number[]): Promise<ApiResponse<void>> {
    // Utiliser POST ou PUT pour envoyer les données, ou construire l'URL avec les IDs
    return this.apiService.post<void>(`/oeuvres/${oeuvreId}/tags/remove`, { tag_ids: tagIds });
  }

  // HELPER - Vérifier si un tag existe
  async tagExists(nom: string): Promise<ApiResponse<{ exists: boolean; tag?: TagMotCleType }>> {
    return this.apiService.get<{ exists: boolean; tag?: TagMotCleType }>(`/tags/exists/${encodeURIComponent(nom)}`);
  }

  // HELPER - Récupérer les tags suggérés
  async getSuggestedTags(query: string, limit: number = 5): Promise<ApiResponse<TagMotCleType[]>> {
    return this.apiService.get<TagMotCleType[]>('/tags/suggestions', { query, limit });
  }

  // HELPER - Récupérer ou créer un tag
  async getOrCreateTag(nom: string): Promise<ApiResponse<TagMotCleType>> {
    return this.apiService.post<TagMotCleType>('/tags/get-or-create', { nom });
  }

  // HELPER - Compter les utilisations d'un tag
  async getTagUsageCount(id: number): Promise<ApiResponse<{ count: number }>> {
    return this.apiService.get<{ count: number }>(`/tags/${id}/usage-count`);
  }

  // HELPER - Récupérer les tags non utilisés
  async getUnusedTags(): Promise<ApiResponse<TagMotCleType[]>> {
    return this.apiService.get<TagMotCleType[]>('/tags/unused');
  }

  // VALIDATION - Valider les données de tag
  private validateTagData(data: TagCreateData): string | null {
    if (!data.nom?.trim()) return 'Le nom du tag est requis';
    if (data.nom.length > 50) return 'Le nom du tag ne peut pas dépasser 50 caractères';
    
    // Validation des caractères spéciaux si nécessaire
    if (!/^[a-zA-Z0-9À-ÿ\s\-_]+$/.test(data.nom)) {
      return 'Le nom du tag contient des caractères non autorisés';
    }

    return null;
  }

  // VALIDATION - Valider les données de mise à jour de tag
  private validateTagUpdateData(data: TagUpdateData): string | null {
    if (data.nom !== undefined) {
      if (!data.nom.trim()) return 'Le nom du tag ne peut pas être vide';
      if (data.nom.length > 50) return 'Le nom du tag ne peut pas dépasser 50 caractères';
      
      if (!/^[a-zA-Z0-9À-ÿ\s\-_]+$/.test(data.nom)) {
        return 'Le nom du tag contient des caractères non autorisés';
      }
    }

    return null;
  }
}