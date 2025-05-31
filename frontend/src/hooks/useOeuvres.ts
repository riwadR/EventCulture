// hooks/useOeuvres.ts

import { useState, useCallback } from 'react';
import { OeuvreService, OeuvreFilters, OeuvreCreateData, OeuvreUpdateData } from '../services/oeuvreService';
import { OeuvreType, StatutOeuvreEnum } from '../types/oeuvreType';
import { CritiqueEvaluationType } from '../types/CritiqueEvaluationType';
import { usePaginatedApi, useApi } from './useApi';

interface UseOeuvresReturn {
  // État des œuvres paginées
  oeuvres: OeuvreType[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  // Actions CRUD
  loadOeuvres: (page?: number, filters?: OeuvreFilters) => Promise<OeuvreType[] | null>;
  createOeuvre: (data: OeuvreCreateData) => Promise<OeuvreType | null>;
  updateOeuvre: (id: number, data: OeuvreUpdateData) => Promise<OeuvreType | null>;
  deleteOeuvre: (id: number) => Promise<boolean>;
  
  // Actions de validation
  submitForValidation: (id: number) => Promise<boolean>;
  validateOeuvre: (id: number) => Promise<boolean>;
  rejectOeuvre: (id: number, reason: string) => Promise<boolean>;
  archiveOeuvre: (id: number) => Promise<boolean>;
  
  // Actions de critique
  addCritique: (oeuvreId: number, note?: number, commentaire?: string) => Promise<boolean>;
  updateCritique: (oeuvreId: number, critiqueId: number, note?: number, commentaire?: string) => Promise<boolean>;
  deleteCritique: (oeuvreId: number, critiqueId: number) => Promise<boolean>;
  
  // Gestion des tags
  addTags: (oeuvreId: number, tags: string[]) => Promise<boolean>;
  removeTags: (oeuvreId: number, tags: string[]) => Promise<boolean>;
  
  // Filtres et recherche
  searchOeuvres: (query: string, filters?: OeuvreFilters) => Promise<OeuvreType[] | null>;
  searchByTags: (tags: string[], filters?: OeuvreFilters) => Promise<OeuvreType[] | null>;
  loadPublishedOeuvres: (filters?: OeuvreFilters) => Promise<OeuvreType[] | null>;
  loadPendingOeuvres: (filters?: OeuvreFilters) => Promise<OeuvreType[] | null>;
  loadPopularOeuvres: (limit?: number) => Promise<OeuvreType[] | null>;
  loadRecentOeuvres: (limit?: number) => Promise<OeuvreType[] | null>;
  
  // Utilitaires
  refresh: () => Promise<OeuvreType[] | null>;
  clearError: () => void;
  reset: () => void;
}

export const useOeuvres = (initialFilters?: OeuvreFilters): UseOeuvresReturn => {
  const oeuvreService = OeuvreService.getInstance();
  
  // Hook pour la liste paginée des œuvres
  const paginatedApi = usePaginatedApi(
    (filters) => oeuvreService.getAllOeuvres(filters),
    initialFilters
  );

  // Hooks pour les actions individuelles
  const createApi = useApi((data: OeuvreCreateData) => oeuvreService.createOeuvre(data));
  const updateApi = useApi((id: number, data: OeuvreUpdateData) => oeuvreService.updateOeuvre(id, data));
  const deleteApi = useApi((id: number) => oeuvreService.deleteOeuvre(id));
  const submitApi = useApi((id: number) => oeuvreService.submitForValidation(id));
  const validateApi = useApi((id: number) => oeuvreService.validateOeuvre(id));
  const rejectApi = useApi((id: number, reason: string) => oeuvreService.rejectOeuvre(id, reason));
  const archiveApi = useApi((id: number) => oeuvreService.archiveOeuvre(id));

  // Créer une œuvre
  const createOeuvre = useCallback(async (data: OeuvreCreateData): Promise<OeuvreType | null> => {
    const result = await createApi.execute(data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [createApi, paginatedApi]);

  // Mettre à jour une œuvre
  const updateOeuvre = useCallback(async (id: number, data: OeuvreUpdateData): Promise<OeuvreType | null> => {
    const result = await updateApi.execute(id, data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [updateApi, paginatedApi]);

  // Supprimer une œuvre
  const deleteOeuvre = useCallback(async (id: number): Promise<boolean> => {
    const result = await deleteApi.execute(id);
    if (result !== null) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [deleteApi, paginatedApi]);

  // Soumettre pour validation
  const submitForValidation = useCallback(async (id: number): Promise<boolean> => {
    const result = await submitApi.execute(id);
    if (result) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [submitApi, paginatedApi]);

  // Valider une œuvre
  const validateOeuvre = useCallback(async (id: number): Promise<boolean> => {
    const result = await validateApi.execute(id);
    if (result) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [validateApi, paginatedApi]);

  // Rejeter une œuvre
  const rejectOeuvre = useCallback(async (id: number, reason: string): Promise<boolean> => {
    const result = await rejectApi.execute(id, reason);
    if (result) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [rejectApi, paginatedApi]);

  // Archiver une œuvre
  const archiveOeuvre = useCallback(async (id: number): Promise<boolean> => {
    const result = await archiveApi.execute(id);
    if (result) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [archiveApi, paginatedApi]);

  // Ajouter une critique
  const addCritique = useCallback(async (oeuvreId: number, note?: number, commentaire?: string): Promise<boolean> => {
    try {
      const response = await oeuvreService.addCritique(oeuvreId, note, commentaire);
      if (response.success) {
        await paginatedApi.refresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [oeuvreService, paginatedApi]);

  // Mettre à jour une critique
  const updateCritique = useCallback(async (oeuvreId: number, critiqueId: number, note?: number, commentaire?: string): Promise<boolean> => {
    try {
      const response = await oeuvreService.updateCritique(oeuvreId, critiqueId, note, commentaire);
      if (response.success) {
        await paginatedApi.refresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [oeuvreService, paginatedApi]);

  // Supprimer une critique
  const deleteCritique = useCallback(async (oeuvreId: number, critiqueId: number): Promise<boolean> => {
    try {
      const response = await oeuvreService.deleteCritique(oeuvreId, critiqueId);
      if (response.success) {
        await paginatedApi.refresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [oeuvreService, paginatedApi]);

  // Ajouter des tags
  const addTags = useCallback(async (oeuvreId: number, tags: string[]): Promise<boolean> => {
    try {
      const response = await oeuvreService.addTags(oeuvreId, tags);
      if (response.success) {
        await paginatedApi.refresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [oeuvreService, paginatedApi]);

  // Retirer des tags
  const removeTags = useCallback(async (oeuvreId: number, tags: string[]): Promise<boolean> => {
    try {
      const response = await oeuvreService.removeTags(oeuvreId, tags);
      if (response.success) {
        await paginatedApi.refresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [oeuvreService, paginatedApi]);

  // Rechercher des œuvres
  const searchOeuvres = useCallback(async (query: string, filters?: OeuvreFilters): Promise<OeuvreType[] | null> => {
    return paginatedApi.execute(1, { ...filters, search: query });
  }, [paginatedApi]);

  // Rechercher par tags
  const searchByTags = useCallback(async (tags: string[], filters?: OeuvreFilters): Promise<OeuvreType[] | null> => {
    try {
      const response = await oeuvreService.searchByTags(tags, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [oeuvreService]);

  // Charger les œuvres publiées
  const loadPublishedOeuvres = useCallback(async (filters?: OeuvreFilters): Promise<OeuvreType[] | null> => {
    try {
      const response = await oeuvreService.getPublishedOeuvres(filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [oeuvreService]);

  // Charger les œuvres en attente
  const loadPendingOeuvres = useCallback(async (filters?: OeuvreFilters): Promise<OeuvreType[] | null> => {
    try {
      const response = await oeuvreService.getPendingOeuvres(filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [oeuvreService]);

  // Charger les œuvres populaires
  const loadPopularOeuvres = useCallback(async (limit: number = 10): Promise<OeuvreType[] | null> => {
    try {
      const response = await oeuvreService.getPopularOeuvres(limit);
      return response.success ? response.data || [] : null;
    } catch {
      return null;
    }
  }, [oeuvreService]);

  // Charger les œuvres récentes
  const loadRecentOeuvres = useCallback(async (limit: number = 10): Promise<OeuvreType[] | null> => {
    try {
      const response = await oeuvreService.getRecentOeuvres(limit);
      return response.success ? response.data || [] : null;
    } catch {
      return null;
    }
  }, [oeuvreService]);

  // Gérer les erreurs combinées
  const combinedError = paginatedApi.error || createApi.error || updateApi.error || deleteApi.error || 
                       submitApi.error || validateApi.error || rejectApi.error || archiveApi.error;
  const isLoading = paginatedApi.loading || createApi.loading || updateApi.loading || deleteApi.loading ||
                   submitApi.loading || validateApi.loading || rejectApi.loading || archiveApi.loading;

  return {
    // État
    oeuvres: paginatedApi.data,
    total: paginatedApi.total,
    page: paginatedApi.page,
    totalPages: paginatedApi.totalPages,
    loading: isLoading,
    error: combinedError,
    
    // Actions CRUD
    loadOeuvres: paginatedApi.execute,
    createOeuvre,
    updateOeuvre,
    deleteOeuvre,
    
    // Actions de validation
    submitForValidation,
    validateOeuvre,
    rejectOeuvre,
    archiveOeuvre,
    
    // Actions de critique
    addCritique,
    updateCritique,
    deleteCritique,
    
    // Gestion des tags
    addTags,
    removeTags,
    
    // Filtres et recherche
    searchOeuvres,
    searchByTags,
    loadPublishedOeuvres,
    loadPendingOeuvres,
    loadPopularOeuvres,
    loadRecentOeuvres,
    
    // Utilitaires
    refresh: paginatedApi.refresh,
    clearError: () => {
      paginatedApi.clearError();
      createApi.clearError();
      updateApi.clearError();
      deleteApi.clearError();
      submitApi.clearError();
      validateApi.clearError();
      rejectApi.clearError();
      archiveApi.clearError();
    },
    reset: paginatedApi.reset
  };
};