// hooks/useEvenements.ts

import { useState, useCallback, useEffect } from 'react';
import { EvenementService, EvenementFilters, EvenementCreateData, EvenementUpdateData } from '../services/evenementService';
import { EvenementType, StatutParticipationEnum } from '../types/evenementType';
import { usePaginatedApi, useApi } from './useApi';

interface UseEvenementsReturn {
  // État des événements paginés
  evenements: EvenementType[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  // Actions CRUD
  loadEvenements: (page?: number, filters?: EvenementFilters) => Promise<EvenementType[] | null>;
  createEvenement: (data: EvenementCreateData) => Promise<EvenementType | null>;
  updateEvenement: (id: number, data: EvenementUpdateData) => Promise<EvenementType | null>;
  deleteEvenement: (id: number) => Promise<boolean>;
  
  // Actions de participation
  joinEvenement: (evenementId: number, role: string) => Promise<boolean>;
  leaveEvenement: (evenementId: number) => Promise<boolean>;
  updateParticipationStatus: (evenementId: number, userId: number, status: StatutParticipationEnum) => Promise<boolean>;
  
  // Filtres et recherche
  searchEvenements: (query: string, filters?: EvenementFilters) => Promise<EvenementType[] | null>;
  loadUpcomingEvenements: (filters?: EvenementFilters) => Promise<EvenementType[] | null>;
  loadOngoingEvenements: (filters?: EvenementFilters) => Promise<EvenementType[] | null>;
  loadPastEvenements: (filters?: EvenementFilters) => Promise<EvenementType[] | null>;
  
  // Utilitaires
  refresh: () => Promise<EvenementType[] | null>;
  clearError: () => void;
  reset: () => void;
}

export const useEvenements = (initialFilters?: EvenementFilters): UseEvenementsReturn => {
  const evenementService = EvenementService.getInstance();
  
  // Hook pour la liste paginée des événements
  const paginatedApi = usePaginatedApi(
    (filters) => evenementService.getAllEvenements(filters),
    initialFilters
  );

  // Hooks pour les actions individuelles
  const createApi = useApi((data: EvenementCreateData) => evenementService.createEvenement(data));
  const updateApi = useApi((id: number, data: EvenementUpdateData) => evenementService.updateEvenement(id, data));
  const deleteApi = useApi((id: number) => evenementService.deleteEvenement(id));
  const joinApi = useApi((evenementId: number, data: any) => evenementService.joinEvenement(evenementId, data));
  const leaveApi = useApi((evenementId: number) => evenementService.leaveEvenement(evenementId));

  // Créer un événement
  const createEvenement = useCallback(async (data: EvenementCreateData): Promise<EvenementType | null> => {
    const result = await createApi.execute(data);
    if (result) {
      // Rafraîchir la liste après création
      await paginatedApi.refresh();
    }
    return result;
  }, [createApi, paginatedApi]);

  // Mettre à jour un événement
  const updateEvenement = useCallback(async (id: number, data: EvenementUpdateData): Promise<EvenementType | null> => {
    const result = await updateApi.execute(id, data);
    if (result) {
      // Mettre à jour la liste localement
      const updatedData = paginatedApi.data.map(evenement => 
        evenement.id_evenement === id ? result : evenement
      );
      // On pourrait implémenter une méthode updateLocal dans usePaginatedApi
      await paginatedApi.refresh();
    }
    return result;
  }, [updateApi, paginatedApi]);

  // Supprimer un événement
  const deleteEvenement = useCallback(async (id: number): Promise<boolean> => {
    const result = await deleteApi.execute(id);
    if (result !== null) {
      // Retirer l'événement de la liste localement
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [deleteApi, paginatedApi]);

  // Rejoindre un événement
  const joinEvenement = useCallback(async (evenementId: number, role: string): Promise<boolean> => {
    const result = await joinApi.execute(evenementId, { role_participation: role });
    if (result) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [joinApi, paginatedApi]);

  // Quitter un événement
  const leaveEvenement = useCallback(async (evenementId: number): Promise<boolean> => {
    const result = await leaveApi.execute(evenementId);
    if (result !== null) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [leaveApi, paginatedApi]);

  // Mettre à jour le statut de participation
  const updateParticipationStatus = useCallback(async (evenementId: number, userId: number, status: StatutParticipationEnum): Promise<boolean> => {
    try {
      const response = await evenementService.updateParticipationStatus(evenementId, userId, status);
      if (response.success) {
        await paginatedApi.refresh();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [evenementService, paginatedApi]);

  // Rechercher des événements
  const searchEvenements = useCallback(async (query: string, filters?: EvenementFilters): Promise<EvenementType[] | null> => {
    return paginatedApi.execute(1, { ...filters, search: query });
  }, [paginatedApi]);

  // Charger les événements à venir
  const loadUpcomingEvenements = useCallback(async (filters?: EvenementFilters): Promise<EvenementType[] | null> => {
    try {
      const response = await evenementService.getUpcomingEvenements(filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [evenementService]);

  // Charger les événements en cours
  const loadOngoingEvenements = useCallback(async (filters?: EvenementFilters): Promise<EvenementType[] | null> => {
    try {
      const response = await evenementService.getOngoingEvenements(filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [evenementService]);

  // Charger les événements passés
  const loadPastEvenements = useCallback(async (filters?: EvenementFilters): Promise<EvenementType[] | null> => {
    try {
      const response = await evenementService.getPastEvenements(filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [evenementService]);

  // Gérer les erreurs combinées
  const combinedError = paginatedApi.error || createApi.error || updateApi.error || deleteApi.error || joinApi.error || leaveApi.error;
  const isLoading = paginatedApi.loading || createApi.loading || updateApi.loading || deleteApi.loading || joinApi.loading || leaveApi.loading;

  return {
    // État
    evenements: paginatedApi.data,
    total: paginatedApi.total,
    page: paginatedApi.page,
    totalPages: paginatedApi.totalPages,
    loading: isLoading,
    error: combinedError,
    
    // Actions
    loadEvenements: paginatedApi.execute,
    createEvenement,
    updateEvenement,
    deleteEvenement,
    joinEvenement,
    leaveEvenement,
    updateParticipationStatus,
    searchEvenements,
    loadUpcomingEvenements,
    loadOngoingEvenements,
    loadPastEvenements,
    
    // Utilitaires
    refresh: paginatedApi.refresh,
    clearError: () => {
      paginatedApi.clearError();
      createApi.clearError();
      updateApi.clearError();
      deleteApi.clearError();
      joinApi.clearError();
      leaveApi.clearError();
    },
    reset: paginatedApi.reset
  };
};