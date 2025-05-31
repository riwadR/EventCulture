// hooks/useLieuMedia.ts

import { useState, useCallback } from 'react';
import { MediaService, LieuMediaFilters, LieuMediaUploadData, LieuMediaUpdateData } from '../services/MediaService';
import { LieuMediaType } from '../types/lieuType';
import { usePaginatedApi, useApi } from './useApi';

interface UseLieuMediaReturn {
  // État des médias de lieu paginés
  lieuMedias: LieuMediaType[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  // Actions CRUD
  loadLieuMedias: (page?: number, filters?: LieuMediaFilters) => Promise<LieuMediaType[] | null>;
  uploadLieuMedia: (data: LieuMediaUploadData) => Promise<LieuMediaType | null>;
  uploadMultipleLieuMedias: (files: File[], commonData: Omit<LieuMediaUploadData, 'file'>) => Promise<LieuMediaType[] | null>;
  updateLieuMedia: (id: number, data: LieuMediaUpdateData) => Promise<LieuMediaType | null>;
  deleteLieuMedia: (id: number) => Promise<boolean>;
  deleteMultipleLieuMedias: (ids: number[]) => Promise<boolean>;
  
  // Actions spécialisées
  loadMediasByLieu: (lieuId: number, filters?: any) => Promise<LieuMediaType[] | null>;
  loadLieuMediasByType: (type: string, filters?: any) => Promise<LieuMediaType[] | null>;
  
  // Recherche
  searchLieuMedias: (query: string, filters?: LieuMediaFilters) => Promise<LieuMediaType[] | null>;
  
  // Upload avec progress
  uploadWithProgress: (data: LieuMediaUploadData, onProgress?: (progress: number) => void) => Promise<LieuMediaType | null>;
  
  // Utilitaires
  refresh: () => Promise<LieuMediaType[] | null>;
  clearError: () => void;
  reset: () => void;
  getLieuMediaTypes: () => string[];
  isImage: (media: LieuMediaType) => boolean;
  isVideo: (media: LieuMediaType) => boolean;
  generatePreviewUrl: (media: LieuMediaType) => string;
  generateThumbnailUrl: (media: LieuMediaType, size?: 'small' | 'medium' | 'large') => string;
}

export const useLieuMedia = (initialFilters?: LieuMediaFilters): UseLieuMediaReturn => {
  const mediaService = MediaService.getInstance();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  // Hook pour la liste paginée des médias de lieu
  const paginatedApi = usePaginatedApi(
    (filters) => mediaService.getAllLieuMedias(filters),
    initialFilters
  );

  // Hooks pour les actions individuelles
  const uploadApi = useApi((data: LieuMediaUploadData) => mediaService.uploadLieuMedia(data));
  const uploadMultipleApi = useApi((files: File[], commonData: any) => mediaService.uploadMultipleLieuMedias(files, commonData));
  const updateApi = useApi((id: number, data: LieuMediaUpdateData) => mediaService.updateLieuMedia(id, data));
  const deleteApi = useApi((id: number) => mediaService.deleteLieuMedia(id));
  const deleteMultipleApi = useApi((ids: number[]) => mediaService.deleteMultipleLieuMedias(ids));

  // Upload d'un média de lieu
  const uploadLieuMedia = useCallback(async (data: LieuMediaUploadData): Promise<LieuMediaType | null> => {
    const result = await uploadApi.execute(data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [uploadApi, paginatedApi]);

  // Upload multiple médias de lieu
  const uploadMultipleLieuMedias = useCallback(async (files: File[], commonData: Omit<LieuMediaUploadData, 'file'>): Promise<LieuMediaType[] | null> => {
    const result = await uploadMultipleApi.execute(files, commonData);
    if (result && result.length > 0) {
      await paginatedApi.refresh();
    }
    return result;
  }, [uploadMultipleApi, paginatedApi]);

  // Upload avec progress (simulé)
  const uploadWithProgress = useCallback(async (
    data: LieuMediaUploadData, 
    onProgress?: (progress: number) => void
  ): Promise<LieuMediaType | null> => {
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
        const result = await uploadLieuMedia(data);
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
      return uploadLieuMedia(data);
    }
  }, [uploadLieuMedia]);

  // Mettre à jour un média de lieu
  const updateLieuMedia = useCallback(async (id: number, data: LieuMediaUpdateData): Promise<LieuMediaType | null> => {
    const result = await updateApi.execute(id, data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [updateApi, paginatedApi]);

  // Supprimer un média de lieu
  const deleteLieuMedia = useCallback(async (id: number): Promise<boolean> => {
    const result = await deleteApi.execute(id);
    if (result !== null) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [deleteApi, paginatedApi]);

  // Supprimer plusieurs médias de lieu
  const deleteMultipleLieuMedias = useCallback(async (ids: number[]): Promise<boolean> => {
    const result = await deleteMultipleApi.execute(ids);
    if (result !== null) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [deleteMultipleApi, paginatedApi]);

  // Charger les médias d'un lieu
  const loadMediasByLieu = useCallback(async (lieuId: number, filters?: any): Promise<LieuMediaType[] | null> => {
    try {
      const response = await mediaService.getMediasByLieu(lieuId, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [mediaService]);

  // Charger les médias de lieu par type
  const loadLieuMediasByType = useCallback(async (type: string, filters?: any): Promise<LieuMediaType[] | null> => {
    try {
      const response = await mediaService.getLieuMediasByType(type, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [mediaService]);

  // Rechercher des médias de lieu
  const searchLieuMedias = useCallback(async (query: string, filters?: LieuMediaFilters): Promise<LieuMediaType[] | null> => {
    return paginatedApi.execute(1, { ...filters, search: query });
  }, [paginatedApi]);

  // Utilitaires du service
  const getLieuMediaTypes = useCallback(() => {
    return mediaService.getLieuMediaTypes();
  }, [mediaService]);

  const isImage = useCallback((media: LieuMediaType) => {
    return mediaService.isImage(media);
  }, [mediaService]);

  const isVideo = useCallback((media: LieuMediaType) => {
    return mediaService.isVideo(media);
  }, [mediaService]);

  const generatePreviewUrl = useCallback((media: LieuMediaType) => {
    return mediaService.generatePreviewUrl(media);
  }, [mediaService]);

  const generateThumbnailUrl = useCallback((media: LieuMediaType, size?: 'small' | 'medium' | 'large') => {
    return mediaService.generateThumbnailUrl(media, size);
  }, [mediaService]);

  // Gérer les erreurs combinées
  const combinedError = paginatedApi.error || uploadApi.error || uploadMultipleApi.error || 
                       updateApi.error || deleteApi.error || deleteMultipleApi.error;
  const isLoading = paginatedApi.loading || uploadApi.loading || uploadMultipleApi.loading ||
                   updateApi.loading || deleteApi.loading || deleteMultipleApi.loading;

  return {
    // État
    lieuMedias: paginatedApi.data,
    total: paginatedApi.total,
    page: paginatedApi.page,
    totalPages: paginatedApi.totalPages,
    loading: isLoading,
    error: combinedError,
    
    // Actions CRUD
    loadLieuMedias: paginatedApi.execute,
    uploadLieuMedia,
    uploadMultipleLieuMedias,
    updateLieuMedia,
    deleteLieuMedia,
    deleteMultipleLieuMedias,
    
    // Actions spécialisées
    loadMediasByLieu,
    loadLieuMediasByType,
    
    // Recherche
    searchLieuMedias,
    
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
    getLieuMediaTypes,
    isImage,
    isVideo,
    generatePreviewUrl,
    generateThumbnailUrl
  };
};