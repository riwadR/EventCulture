// services/mediaService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { MediaType } from '../types/mediaType';
import { LieuMediaType } from '../types/lieuType';

export interface MediaFilters {
  type_media?: string;
  id_oeuvre?: number;
  id_evenement?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface LieuMediaFilters {
  type?: string;
  id_lieu?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface MediaUploadData {
  file: File;
  type_media: string;
  description?: string;
  id_oeuvre?: number;
  id_evenement?: number;
}

export interface LieuMediaUploadData {
  file: File;
  type: string;
  description?: string;
  id_lieu: number;
}

export interface MediaUpdateData {
  type_media?: string;
  description?: string;
  url?: string;
}

export interface LieuMediaUpdateData {
  type?: string;
  description?: string;
  url?: string;
}

export interface MediaStats {
  totalMedias: number;
  mediasByType: Record<string, number>;
  mediasByOeuvre: Record<string, number>;
  mediasByEvenement: Record<string, number>;
  recentMedias: MediaType[];
  storageUsed: number;
}

export interface LieuMediaStats {
  totalMedias: number;
  mediasByType: Record<string, number>;
  mediasByLieu: Record<string, number>;
  recentMedias: LieuMediaType[];
  storageUsed: number;
}

export class MediaService {
  private static instance: MediaService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  // ===============================
  // MÉDIAS POUR ŒUVRES ET ÉVÉNEMENTS
  // ===============================

  // CREATE - Upload d'un média
  async uploadMedia(data: MediaUploadData): Promise<ApiResponse<MediaType>> {
    const validationError = this.validateMediaUpload(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.upload<MediaType>('/media/upload', data.file, {
      type_media: data.type_media,
      description: data.description,
      id_oeuvre: data.id_oeuvre,
      id_evenement: data.id_evenement
    });
  }

  // CREATE - Upload multiple médias
  async uploadMultipleMedias(files: File[], commonData: Omit<MediaUploadData, 'file'>): Promise<ApiResponse<MediaType[]>> {
    const uploadPromises = files.map(file => 
      this.uploadMedia({ ...commonData, file })
    );

    try {
      const results = await Promise.all(uploadPromises);
      const successResults = results.filter(result => result.success);
      const failedResults = results.filter(result => !result.success);

      if (failedResults.length > 0) {
        return {
          success: false,
          error: `${failedResults.length} fichier(s) n'ont pas pu être téléchargés`
        };
      }

      return {
        success: true,
        data: successResults.map(result => result.data!),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du téléchargement multiple'
      };
    }
  }

  // READ - Récupérer tous les médias avec filtres
  async getAllMedias(filters?: MediaFilters): Promise<ApiResponse<PaginatedResponse<MediaType>>> {
    return this.apiService.get<PaginatedResponse<MediaType>>('/media', filters);
  }

  // READ - Récupérer un média par ID
  async getMediaById(id: number): Promise<ApiResponse<MediaType>> {
    return this.apiService.get<MediaType>(`/media/${id}`);
  }

  // READ - Récupérer les médias d'une œuvre
  async getMediasByOeuvre(oeuvreId: number, filters?: Omit<MediaFilters, 'id_oeuvre'>): Promise<ApiResponse<PaginatedResponse<MediaType>>> {
    return this.apiService.get<PaginatedResponse<MediaType>>(`/oeuvres/${oeuvreId}/media`, filters);
  }

  // READ - Récupérer les médias d'un événement
  async getMediasByEvenement(evenementId: number, filters?: Omit<MediaFilters, 'id_evenement'>): Promise<ApiResponse<PaginatedResponse<MediaType>>> {
    return this.apiService.get<PaginatedResponse<MediaType>>(`/evenements/${evenementId}/media`, filters);
  }

  // READ - Récupérer les médias par type
  async getMediasByType(type: string, filters?: Omit<MediaFilters, 'type_media'>): Promise<ApiResponse<PaginatedResponse<MediaType>>> {
    return this.apiService.get<PaginatedResponse<MediaType>>(`/media/type/${type}`, filters);
  }

  // UPDATE - Mettre à jour un média
  async updateMedia(id: number, data: MediaUpdateData): Promise<ApiResponse<MediaType>> {
    return this.apiService.put<MediaType>(`/media/${id}`, data);
  }

  // DELETE - Supprimer un média
  async deleteMedia(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/media/${id}`);
  }

  // DELETE - Supprimer plusieurs médias
  async deleteMultipleMedias(ids: number[]): Promise<ApiResponse<void>> {
    return this.apiService.post<void>('/media/bulk-delete', { ids });
  }

  // SEARCH - Rechercher des médias
  async searchMedias(query: string, filters?: Omit<MediaFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<MediaType>>> {
    return this.apiService.get<PaginatedResponse<MediaType>>('/media/search', { 
      search: query, 
      ...filters 
    });
  }

  // STATS - Récupérer les statistiques des médias
  async getMediaStats(): Promise<ApiResponse<MediaStats>> {
    return this.apiService.get<MediaStats>('/media/stats');
  }

  // ===============================
  // MÉDIAS POUR LIEUX
  // ===============================

  // CREATE - Upload d'un média de lieu
  async uploadLieuMedia(data: LieuMediaUploadData): Promise<ApiResponse<LieuMediaType>> {
    const validationError = this.validateLieuMediaUpload(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.upload<LieuMediaType>('/lieu-media/upload', data.file, {
      type: data.type,
      description: data.description,
      id_lieu: data.id_lieu
    });
  }

  // CREATE - Upload multiple médias de lieu
  async uploadMultipleLieuMedias(files: File[], commonData: Omit<LieuMediaUploadData, 'file'>): Promise<ApiResponse<LieuMediaType[]>> {
    const uploadPromises = files.map(file => 
      this.uploadLieuMedia({ ...commonData, file })
    );

    try {
      const results = await Promise.all(uploadPromises);
      const successResults = results.filter(result => result.success);
      const failedResults = results.filter(result => !result.success);

      if (failedResults.length > 0) {
        return {
          success: false,
          error: `${failedResults.length} fichier(s) n'ont pas pu être téléchargés`
        };
      }

      return {
        success: true,
        data: successResults.map(result => result.data!),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du téléchargement multiple'
      };
    }
  }

  // READ - Récupérer tous les médias de lieu avec filtres
  async getAllLieuMedias(filters?: LieuMediaFilters): Promise<ApiResponse<PaginatedResponse<LieuMediaType>>> {
    return this.apiService.get<PaginatedResponse<LieuMediaType>>('/lieu-media', filters);
  }

  // READ - Récupérer un média de lieu par ID
  async getLieuMediaById(id: number): Promise<ApiResponse<LieuMediaType>> {
    return this.apiService.get<LieuMediaType>(`/lieu-media/${id}`);
  }

  // READ - Récupérer les médias d'un lieu
  async getMediasByLieu(lieuId: number, filters?: Omit<LieuMediaFilters, 'id_lieu'>): Promise<ApiResponse<PaginatedResponse<LieuMediaType>>> {
    return this.apiService.get<PaginatedResponse<LieuMediaType>>(`/lieux/${lieuId}/media`, filters);
  }

  // READ - Récupérer les médias de lieu par type
  async getLieuMediasByType(type: string, filters?: Omit<LieuMediaFilters, 'type'>): Promise<ApiResponse<PaginatedResponse<LieuMediaType>>> {
    return this.apiService.get<PaginatedResponse<LieuMediaType>>(`/lieu-media/type/${type}`, filters);
  }

  // UPDATE - Mettre à jour un média de lieu
  async updateLieuMedia(id: number, data: LieuMediaUpdateData): Promise<ApiResponse<LieuMediaType>> {
    return this.apiService.put<LieuMediaType>(`/lieu-media/${id}`, data);
  }

  // DELETE - Supprimer un média de lieu
  async deleteLieuMedia(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/lieu-media/${id}`);
  }

  // DELETE - Supprimer plusieurs médias de lieu
  async deleteMultipleLieuMedias(ids: number[]): Promise<ApiResponse<void>> {
    return this.apiService.post<void>('/lieu-media/bulk-delete', { ids });
  }

  // SEARCH - Rechercher des médias de lieu
  async searchLieuMedias(query: string, filters?: Omit<LieuMediaFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<LieuMediaType>>> {
    return this.apiService.get<PaginatedResponse<LieuMediaType>>('/lieu-media/search', { 
      search: query, 
      ...filters 
    });
  }

  // STATS - Récupérer les statistiques des médias de lieu
  async getLieuMediaStats(): Promise<ApiResponse<LieuMediaStats>> {
    return this.apiService.get<LieuMediaStats>('/lieu-media/stats');
  }

  // ===============================
  // UTILITAIRES
  // ===============================

  // Obtenir les types de médias autorisés
  getMediaTypes(): string[] {
    return ['image', 'video', 'audio', 'document', 'autre'];
  }

  // Obtenir les types de médias de lieu autorisés
  getLieuMediaTypes(): string[] {
    return ['photo', 'video', 'plan', 'carte', 'document', 'autre'];
  }

  // Générer une URL de prévisualisation
  generatePreviewUrl(media: MediaType | LieuMediaType): string {
    return `${media.url}?preview=true`;
  }

  // Générer une URL de miniature
  generateThumbnailUrl(media: MediaType | LieuMediaType, size: 'small' | 'medium' | 'large' = 'medium'): string {
    return `${media.url}?thumbnail=${size}`;
  }

  // Vérifier si un média est une image
  isImage(media: MediaType | LieuMediaType): boolean {
    const imageTypes = ['image', 'photo'];
    const mediaType = 'type_media' in media ? media.type_media : media.type;
    return imageTypes.includes(mediaType.toLowerCase());
  }

  // Vérifier si un média est une vidéo
  isVideo(media: MediaType | LieuMediaType): boolean {
    const mediaType = 'type_media' in media ? media.type_media : media.type;
    return mediaType.toLowerCase() === 'video';
  }

  // VALIDATION - Valider l'upload d'un média
  private validateMediaUpload(data: MediaUploadData): string | null {
    if (!data.file) return 'Fichier requis';
    if (!data.type_media?.trim()) return 'Type de média requis';
    
    // Validation du fichier selon le type
    const validationResult = this.validateFileByType(data.file, data.type_media);
    if (!validationResult.isValid) {
      return validationResult.error || 'Erreur de validation du fichier';
    }

    // Au moins une association (œuvre ou événement) est requise
    if (!data.id_oeuvre && !data.id_evenement) {
      return 'Une œuvre ou un événement doit être associé';
    }

    return null;
  }

  // VALIDATION - Valider l'upload d'un média de lieu
  private validateLieuMediaUpload(data: LieuMediaUploadData): string | null {
    if (!data.file) return 'Fichier requis';
    if (!data.type?.trim()) return 'Type de média requis';
    if (!data.id_lieu) return 'Lieu requis';
    
    // Validation du fichier selon le type
    const validationResult = this.validateFileByType(data.file, data.type);
    if (!validationResult.isValid) {
      return validationResult.error || 'Erreur de validation du fichier';
    }

    return null;
  }

  // VALIDATION - Valider un fichier selon son type
  private validateFileByType(file: File, mediaType: string): { isValid: boolean; error: string | null } {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      photo: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
      audio: 50 * 1024 * 1024, // 50MB
      document: 20 * 1024 * 1024, // 20MB
      plan: 20 * 1024 * 1024, // 20MB
      carte: 20 * 1024 * 1024, // 20MB
      autre: 50 * 1024 * 1024 // 50MB
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
      audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      plan: ['image/jpeg', 'image/png', 'application/pdf'],
      carte: ['image/jpeg', 'image/png', 'application/pdf'],
      autre: ['*'] // Tous les types autorisés
    };

    const maxSize = maxSizes[mediaType as keyof typeof maxSizes] || maxSizes.autre;
    const types = allowedTypes[mediaType as keyof typeof allowedTypes] || allowedTypes.autre;

    // Vérifier la taille
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `Fichier trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Vérifier le type (sauf pour 'autre')
    if (!types.includes('*') && !types.includes(file.type)) {
      return {
        isValid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${types.join(', ')}`
      };
    }

    return { isValid: true, error: null };
  }
}