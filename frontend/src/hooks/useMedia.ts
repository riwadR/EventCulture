// hooks/useMedia.ts

import { useState, useCallback } from 'react';
import { MediaService, MediaFilters, MediaUploadData, MediaUpdateData } from '../services/MediaService';
import { MediaType } from '../types/mediaType';
import { usePaginatedApi, useApi } from './useApi';

interface UseMediaReturn {
  // État des médias paginés
  medias: MediaType[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  // Actions CRUD
  loadMedias: (page?: number, filters?: MediaFilters) => Promise<MediaType[] | null>;
  uploadMedia: (data: MediaUploadData) => Promise<MediaType | null>;
  uploadMultipleMedias: (files: File[], commonData: Omit<MediaUploadData, 'file'>) => Promise<MediaType[] | null>;
  updateMedia: (id: number, data: MediaUpdateData) => Promise<MediaType | null>;
  deleteMedia: (id: number) => Promise<boolean>;
  deleteMultipleMedias: (ids: number[]) => Promise<boolean>;
  
  // Actions spécialisées
  loadMediasByOeuvre: (oeuvreId: number, filters?: any) => Promise<MediaType[] | null>;
  loadMediasByEvenement: (evenementId: number, filters?: any) => Promise<MediaType[] | null>;
  loadMediasByType: (type: string, filters?: any) => Promise<MediaType[] | null>;
  
  // Recherche
  searchMedias: (query: string, filters?: MediaFilters) => Promise<MediaType[] | null>;
  
  // Upload avec progress
  uploadWithProgress: (data: MediaUploadData, onProgress?: (progress: number) => void) => Promise<MediaType | null>;
  
  // Utilitaires
  refresh: () => Promise<MediaType[] | null>;
  clearError: () => void;
  reset: () => void;
  getMediaTypes: () => string[];
  isImage: (media: MediaType) => boolean;
  isVideo: (media: MediaType) => boolean;
  generatePreviewUrl: (media: MediaType) => string;
  generateThumbnailUrl: (media: MediaType, size?: 'small' | 'medium' | 'large') => string;
}

export const useMedia = (initialFilters?: MediaFilters): UseMediaReturn => {
  const mediaService = MediaService.getInstance();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  // Hook pour la liste paginée des médias
  const paginatedApi = usePaginatedApi(
    (filters) => mediaService.getAllMedias(filters),
    initialFilters
  );

  // Hooks pour les actions individuelles
  const uploadApi = useApi((data: MediaUploadData) => mediaService.uploadMedia(data));
  const uploadMultipleApi = useApi((files: File[], commonData: any) => mediaService.uploadMultipleMedias(files, commonData));
  const updateApi = useApi((id: number, data: MediaUpdateData) => mediaService.updateMedia(id, data));
  const deleteApi = useApi((id: number) => mediaService.deleteMedia(id));
  const deleteMultipleApi = useApi((ids: number[]) => mediaService.deleteMultipleMedias(ids));

  // Upload d'un média
  const uploadMedia = useCallback(async (data: MediaUploadData): Promise<MediaType | null> => {
    const result = await uploadApi.execute(data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [uploadApi, paginatedApi]);

  // Upload multiple médias
  const uploadMultipleMedias = useCallback(async (files: File[], commonData: Omit<MediaUploadData, 'file'>): Promise<MediaType[] | null> => {
    const result = await uploadMultipleApi.execute(files, commonData);
    if (result && result.length > 0) {
      await paginatedApi.refresh();
    }
    return result;
  }, [uploadMultipleApi, paginatedApi]);

  // Upload avec progress (simulé)
  const uploadWithProgress = useCallback(async (
    data: MediaUploadData, 
    onProgress?: (progress: number) => void
  ): Promise<MediaType | null> => {
    const fileId = `${data.file.name}-${Date.now()}`;
    
    // Simuler le progress
    if (onProgress) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          const newProgress = Math.min(currentProgress + Math.random() * 20, 90);
          onProgress(newProgress);
          return { ...prev, [fileId]: newProgress };
        });
      }, 200);

      try {
        const result = await uploadMedia(data);
        clearInterval(interval);
        
        // Compléter à 100%
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        onProgress(100);
        
        // Nettoyer après un délai
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileId]: removed, ...rest } = prev;
            return rest;
          });
        }, 1000);
        
        return result;
      } catch (error) {
        clearInterval(interval);
        setUploadProgress(prev => {
          const { [fileId]: removed, ...rest } = prev;
          return rest;
        });
        throw error;
      }
    } else {
      return uploadMedia(data);
    }
  }, [uploadMedia]);

  // Mettre à jour un média
  const updateMedia = useCallback(async (id: number, data: MediaUpdateData): Promise<MediaType | null> => {
    const result = await updateApi.execute(id, data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [updateApi, paginatedApi]);

  // Supprimer un média
  const deleteMedia = useCallback(async (id: number): Promise<boolean> => {
    const result = await deleteApi.execute(id);
    if (result !== null) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [deleteApi, paginatedApi]);

  // Supprimer plusieurs médias
  const deleteMultipleMedias = useCallback(async (ids: number[]): Promise<boolean> => {
    const result = await deleteMultipleApi.execute(ids);
    if (result !== null) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [deleteMultipleApi, paginatedApi]);

  // Charger les médias d'une œuvre
  const loadMediasByOeuvre = useCallback(async (oeuvreId: number, filters?: any): Promise<MediaType[] | null> => {
    try {
      const response = await mediaService.getMediasByOeuvre(oeuvreId, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [mediaService]);

  // Charger les médias d'un événement
  const loadMediasByEvenement = useCallback(async (evenementId: number, filters?: any): Promise<MediaType[] | null> => {
    try {
      const response = await mediaService.getMediasByEvenement(evenementId, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [mediaService]);

  // Charger les médias par type
  const loadMediasByType = useCallback(async (type: string, filters?: any): Promise<MediaType[] | null> => {
    try {
      const response = await mediaService.getMediasByType(type, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [mediaService]);

  // Rechercher des médias
  const searchMedias = useCallback(async (query: string, filters?: MediaFilters): Promise<MediaType[] | null> => {
    return paginatedApi.execute(1, { ...filters, search: query });
  }, [paginatedApi]);

  // Utilitaires du service
  const getMediaTypes = useCallback(() => {
    return mediaService.getMediaTypes();
  }, [mediaService]);

  const isImage = useCallback((media: MediaType) => {
    return mediaService.isImage(media);
  }, [mediaService]);

  const isVideo = useCallback((media: MediaType) => {
    return mediaService.isVideo(media);
  }, [mediaService]);

  const generatePreviewUrl = useCallback((media: MediaType) => {
    return mediaService.generatePreviewUrl(media);
  }, [mediaService]);

  const generateThumbnailUrl = useCallback((media: MediaType, size?: 'small' | 'medium' | 'large') => {
    return mediaService.generateThumbnailUrl(media, size);
  }, [mediaService]);

  // Gérer les erreurs combinées
  const combinedError = paginatedApi.error || uploadApi.error || uploadMultipleApi.error || 
                       updateApi.error || deleteApi.error || deleteMultipleApi.error;
  const isLoading = paginatedApi.loading || uploadApi.loading || uploadMultipleApi.loading ||
                   updateApi.loading || deleteApi.loading || deleteMultipleApi.loading;

  return {
    // État
    medias: paginatedApi.data,
    total: paginatedApi.total,
    page: paginatedApi.page,
    totalPages: paginatedApi.totalPages,
    loading: isLoading,
    error: combinedError,
    
    // Actions CRUD
    loadMedias: paginatedApi.execute,
    uploadMedia,
    uploadMultipleMedias,
    updateMedia,
    deleteMedia,
    deleteMultipleMedias,
    
    // Actions spécialisées
    loadMediasByOeuvre,
    loadMediasByEvenement,
    loadMediasByType,
    
    // Recherche
    searchMedias,
    
    // Upload avec progress
    uploadWithProgress,
    
    // Utilitaires
    refresh: paginatedApi.refresh,
    clearError: () => {
      paginatedApi.clearError();
      uploadApi.clearError();
      uploadMultipleApi.clearError();
      updateApi.clearError();
      deleteApi.clearError();
      deleteMultipleApi.clearError();
    },
    reset: paginatedApi.reset,
    getMediaTypes,
    isImage,
    isVideo,
    generatePreviewUrl,
    generateThumbnailUrl
  };
};